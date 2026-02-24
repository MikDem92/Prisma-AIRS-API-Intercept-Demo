import OpenAI from "openai";

import { CosmosClient } from "@azure/cosmos";

import { v4 } from "uuid"; 

import {
    AI_CHAT_ENDPOINT,
    AI_CHAT_KEY,
    AI_CHAT_MODEL,
    PRISMA_AIRS_ENDPOINT,
    PRISMA_AIRS_SECURITY_KEY,
    COSMOSDB_ENDPOINT,
    COSMOSDB_KEY,
    COSMOSDB_DATABASE,
    COSMOSDB_CONTAINER
} from "./settings.js";

import { PrismaAirs } from "./prismaAirs.js";

const client = new OpenAI({
    baseURL: AI_CHAT_ENDPOINT,
    apiKey: AI_CHAT_KEY
});

/// Specify the Security Profile ID here ///
const PRISMA_AIRS_PROFILE_ID = "";
////////////////////////////////////////////

const prismaAirsClient = new PrismaAirs({
    endpoint: PRISMA_AIRS_ENDPOINT,
    apiKey: PRISMA_AIRS_SECURITY_KEY,
    profileId: PRISMA_AIRS_PROFILE_ID,
    modelName: AI_CHAT_MODEL
});


const cosmosClient = new CosmosClient({
    endpoint: COSMOSDB_ENDPOINT,
    key: COSMOSDB_KEY
});


/**
 * Writes the prompt and response to CosmosDB
 * 
 * @param {String} chatId - The chat session ID
 * @param {String} prompt - User prompt
 * @param {String} response - AI assistant response
 * @returns {Promise<void>} Resolves if write is successful
 */
export async function writeToDb(chatId, prompt, response){
    try {
        const container = cosmosClient.database(COSMOSDB_DATABASE).container(COSMOSDB_CONTAINER);       

        const input = {
            id: v4(),
            chatId,
            prompt,
            response,
            createdAt: Date.now()
        };

        await container.items.create(input);

    } catch (error) {
        console.error(error.message);
    }
}

/**
 * Reads the top X chat entries from CosmosDB delivering the context of the conversation.
 * 
 * @param {String} chatId - The chat session ID
 * @param {Number} x - Number of most recent entries to be returned
 * @returns {Promise<Array>} An array of objects containing the recent user prompts and AI responses
 */
export async function readTopXFromDB(chatId, x) {
    try {
        const container = cosmosClient.database(COSMOSDB_DATABASE).container(COSMOSDB_CONTAINER);

        const querySpec = {
            query: `
                SELECT c.prompt, c.response
                FROM Chats c
                WHERE c.chatId = @chatId
                ORDER BY c.createdAt DESC
                OFFSET 0 LIMIT @x
            `,
            parameters: [
                { name: "@chatId", value: chatId },
                { name: "@x", value: x}
            ],
        };

        const options = {
            partitionKey: [chatId]
        };

        const cosmosResponse = await container.items.query(querySpec, options).fetchAll();
        return cosmosResponse.resources;

    } catch (error) {
        console.error(error.message);
    }
}


/**
 * Chat with the LLM hosted in Azure.
 * 
 * @param {String} chatId - The ID of the chat
 * @param {String} message - Input text message
 * @returns {Promise<String>} Chat response
 */
export async function chat(chatId, prompt) {
    try {
        //console.log("Chat ID: ", chatId);
        const chatContext = await readTopXFromDB(chatId, 10);

        //console.log("The old raw context: ", chatContext);
        //console.log("Reading ", chatContext.length, " records");

        let messages = [];
        for (const record of chatContext){
            messages.push({ role: "user", content: record.prompt });
            messages.push({ role: "assistant", content: record.response });
        }

        messages.push({ role: "user", content: prompt });

        //console.log("The new context: ", messages);

        if (PRISMA_AIRS_PROFILE_ID && PRISMA_AIRS_PROFILE_ID.trim() !== "") {
            const prismaAirsResponse = await prismaAirsClient.scanRequest(chatId, prompt);
            console.log(prismaAirsResponse);
            const { action, prompt_detected } = prismaAirsResponse;

            if (action === "block"){
                const blockReason = PrismaAirs.determineBlockReason(prompt_detected);
                return `Prisma AIRS hat Ihre Anfrage blockiert. Grund: ${blockReason}`;
            }
        }

        const completion = await client.chat.completions.create({
            messages,
            model: AI_CHAT_MODEL,
        });
        const response = completion.choices[0].message.content;

        console.log("The chat bot responds with: ", response.slice(0, 10), "...");

        if (PRISMA_AIRS_PROFILE_ID && PRISMA_AIRS_PROFILE_ID.trim() !== "") {
            const responseScan = await prismaAirsClient.scanResponse(chatId, prompt, response);
            console.log(responseScan);
            const { action, response_detected } = responseScan;

            if (action === "block"){
                const blockReason = PrismaAirs.determineBlockReason(response_detected);
                return `Prisma AIRS hat die Antwort des Assistenten blockiert. Grund: ${blockReason}`;
            }
        }

        await writeToDb(chatId, prompt, response);

        return response;

    } catch (error) {
        console.error(error.message);
        if (error.code == 400) {
            return "Ihre Anfrage wurde von dem KI-Assistenten verworfen.";
        } else {
            return "Fehler bei der Bearbeitung Ihrer Anfrage. Bitte versuchen Sie es später erneut...";
        }
    }
}