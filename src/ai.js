import OpenAI from "openai";

import {
    AI_CHAT_ENDPOINT,
    AI_CHAT_KEY,
    AI_CHAT_MODEL,
    PRISMA_AIRS_ENDPOINT,
    PRISMA_AIRS_SECURITY_KEY,
    PRISMA_AIRS_PROFILE_ID
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


/**
 * Chat with the LLM hosted in Azure.
 * 
 * @param {String} message - Input text message
 * @returns {String} Chat response
 */
export async function chat(prompt) {
    try {
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