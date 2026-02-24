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
     * @param {string} endpoint - The base URL for the PrismaAirs API.
     * @param {string} apiKey - The authentication key for the API.
     * @param {string} profileId - The specific AI profile identifier to use.
     * @param {string} modelName - The name of the AI model used
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
     * 
     * @param {string} chatId - The chat ID to track the sessions
     * @param {string} prompt - The text prompt to scan.
     * @returns {Promise<Object>} The scan response object
     */
    async scanRequest(chatId, prompt) {
        const payload = {
            tr_id: uuidv4(),
            session_id: chatId,
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
    async scanResponse(chatId, prompt, response) {
        const payload = {
            tr_id: uuidv4(),
            session_id: chatId,
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


    /**
     * Returns block reason in natural language
     * 
     * @param {Object} detectionObject - Either prompt_detected or response_detected object
     * @returns {Array<String>} Block reasons in natural language
     */
    static determineBlockReasons(detectionObject) {
        try {
            if (!detectionObject) throw new Error("The input is not an object");

            const blockReasons = [];
            for (const category in detectionObject) {
                if (detectionObject[category] === true) {
                    switch (category) {
                        case 'dlp':
                            blockReasons.push('Verletzung der Datenschutzrichtlinien');
                            break;
                        case 'injection':
                            blockReasons.push('Injection erkannt');
                            break;
                        case 'malicious_code':
                            blockReasons.push('Schadcode erkannt');
                            break;
                        case 'topic_violation':
                            blockReasons.push('Thema nicht erlaubt');
                            break;
                        case 'toxic_content':
                            blockReasons.push('Schadhafter Content erkannt');
                            break;
                        case 'url_cats':
                            blockReasons.push('Verdächtige URL erkannt');
                            break;
                        default:
                            break; // Keep looking if it's an unknown category
                    }
                }
            }
            if (blockReasons.length == 0){
                blockReasons.push('Sonstiges');
            }

            return blockReasons;
        } catch (error) {
            console.error("Error determining block reason:", error.message);
            return ['Unbekannt'];
        }
    }
}