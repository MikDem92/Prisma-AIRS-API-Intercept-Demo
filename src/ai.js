import OpenAI from "openai";

import CosmosClient from "@azure/cosmos";

import v4 from "uuid"; 

import {
    AI_CHAT_ENDPOINT,
    AI_CHAT_KEY,
    AI_CHAT_MODEL,
    PRISMA_AIRS_ENDPOINT,
    PRISMA_AIRS_SECURITY_KEY,
    PRISMA_AIRS_PROFILE_ID,
    COSMOSDB_ENDPOINT,
    COSMOSDB_KEY,
    COSMOSDB_DATABASE,
    COSMOSDB_CONTAINER
} from "./constants.js";

import { PrismaAirs } from "./prismaAirs.js";

const client = new OpenAI({
    baseURL: AI_CHAT_ENDPOINT,
    apiKey: AI_CHAT_KEY
});

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

        const cosmosResponse = await container.items.query(querySpec).fetchAll();
        return cosmosResponse.resources;

    } catch (error) {
        console.error(error.message);
    }
}


/**
 * Chat with the LLM hosted in Azure.
 * 
 * @param {String} message - Input text message
 * @returns {String} Chat response
 */
export async function chat(prompt) {
    try {
        /**
        const prismaAirsResponse = await prismaAirsClient.scanRequest(prompt);
        console.log(prismaAirsResponse);
        const { action, category } = prismaAirsResponse;

        if (action === "block"){
            if (category === "malicious") {
                return "Prisma AIRS discovered a malicious prompt!"
            } else {
                return "Prisma AIRS discovered a prompt which violates the company policy."
            }
        }
        **/

        const completion = await client.chat.completions.create({
            messages: [
                //{ role: "developer", content: "System prompt" },
                { role: "user", content: prompt }
            ],
            model: AI_CHAT_MODEL,
        });
        const response = completion.choices[0].message.content;
        return response;
    } catch (error) {
        console.error(error.message);
        if (error.code == 400) {
            return "The response was filtered due to the prompt triggering the model-native security policy";
        } else {
            return "I encountered an error while processing your request. Please try again later..."
        }
    }
}