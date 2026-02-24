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

        //console.log("PrismaAirs scanRequest payload:", JSON.stringify(payload));

        const apiResponse = await fetch(this.#endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-pan-token': this.#apiKey
            },
            // Convert the JavaScript object to a JSON string for the body
            body: JSON.stringify(payload)
        });

        const result = await apiResponse.json();

        // Check for non-200 responses and throw an error
        if (!apiResponse.ok) {
            const errorMessage = result.error?.message || result.message || apiResponse.statusText;
            throw new Error(`PrismaAirs request failed. API Message: ${errorMessage}`);
        }

        //console.log(JSON.stringify(result));
        return result;
    }


    /**
     * Sends a scanning request with a model response.
     * @param {string} prompt The original prompt that generated the response.
     * @param {string} response The model response to scan.
     */
    async scanResponse(prompt, response) {
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
                    response: response,
                    context: prompt
                }
            ]
        };

        const apiResponse = await fetch(this.#endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-pan-token': this.#apiKey
            },
            // Convert the JavaScript object to a JSON string for the body
            body: JSON.stringify(payload)
        });

        const result = await apiResponse.json();

        // Check for non-200 responses and throw an error
        if (!apiResponse.ok) {
            const errorMessage = result.error?.message || result.message || apiResponse.statusText;
            throw new Error(`PrismaAirs request failed. API Message: ${errorMessage}`);
        }

        //console.log(JSON.stringify(result));
        return result;
    }
}