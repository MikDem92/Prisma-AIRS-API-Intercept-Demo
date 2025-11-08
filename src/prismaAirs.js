import { v4 as uuidv4 } from 'uuid';

/**
 * @fileoverview Client class for interacting with the PrismaAirs API.
 * Uses private class fields for secure storage of credentials.
 */

export class PrismaAirs {
    // Private fields for encapsulation, ensuring credentials are not easily accessed
    #endpoint;
    #apiKey;
    #profileId;
    #modelName;

    /**
     * Constructs a new PrismaAirsClient instance.
     * @param {string} endpoint The base URL for the PrismaAirs API.
     * @param {string} apiKey The authentication key for the API.
     * @param {string} profileId The specific AI profile identifier to use.
     * @param {string} modelName The name of the AI model used
     */
    constructor({ endpoint, apiKey, profileId, modelName }) {
        if (!endpoint || !apiKey || !profileId || !modelName) {
            console.error("PrismaAirsClient requires endpoint, apiKey, and profileId.");
        }
        this.#endpoint = endpoint;
        this.#apiKey = apiKey;
        this.#profileId = profileId;
        this.#modelName = modelName;
    }

    /**
     * Sends a scanning request with a user prompt.
     * (Currently empty, waiting for integration logic.)
     * @param {string} prompt The text prompt to scan.
     */
    async scanRequest(prompt) {
        const payload = {
            tr_id: uuidv4(),
            ai_profile: {
                profile_id: this.#profileId
            },
            metadata: {
                app_name: "My Chat Assistant",
                ai_model: this.#modelName
            },
            contents: [
                {
                    prompt: prompt
                }
            ]
        };

        const response = await fetch(this.#endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-pan-token': this.#apiKey
            },
            // Convert the JavaScript object to a JSON string for the body
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        //console.log(JSON.stringify(result));
        return result;
    }
}