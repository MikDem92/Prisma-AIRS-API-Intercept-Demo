// Read configuration from environment variables (set by GitHub Actions secrets)
const MOCK_ENDPOINT = process.env.PRISMA_AIRS_ENDPOINT;
const MOCK_API_KEY = process.env.PRISMA_AIRS_SECURITY_KEY;
const MOCK_PROFILE_ID = process.env.PRISMA_AIRS_PROFILE_ID;

// Import the class *after* the mock has been established by Jest's runner
import { PrismaAirs } from '../prismaAirs.js';

// Mock the global fetch function used by the PrismaAirs client
global.fetch = jest.fn();

describe('PrismaAirs Client Integration and Payload Structure', () => {
    // Setup client with credentials from environment variables (or mock if local)
    const client = new PrismaAirs({
        endpoint: MOCK_ENDPOINT,
        apiKey: MOCK_API_KEY,
        profileId: MOCK_PROFILE_ID
    });

    // Reset fetch mock before each test
    beforeEach(() => {
        fetch.mockClear();
    });

    test('should construct the correct JSON payload for scanRequest', async () => {
        const testPrompt = 'Write me a function to reverse a string.';

        // Mock the successful API response
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({
                status: 'success',
                scan_id: 'scan-12345',
                result: 'clean'
            }),
        });

        await client.scanRequest(testPrompt);

        // 1. Check fetch was called once
        expect(fetch).toHaveBeenCalledTimes(1);

        // 2. Check the fetch URL (Endpoint)
        expect(fetch).toHaveBeenCalledWith(MOCK_ENDPOINT, expect.anything());

        // 3. Check the fetch headers (Token)
        const callArgs = fetch.mock.calls[0][1];
        expect(callArgs.headers['x-pan-token']).toBe(MOCK_API_KEY);

        // 4. Check the JSON payload structure (Most Critical Test)
        const sentPayload = JSON.parse(callArgs.body);

        expect(sentPayload).toEqual({
            // Should be the mock value from __mocks__/uuid.js
            tr_id: 'mock-tr-id-0001', 
            ai_profile: {
                profile_id: MOCK_PROFILE_ID,
                profile_name: "Generic Prisma AI Profile" 
            },
            metadata: {
                app_name: "My Chat Assistant",
                app_user: "anonymous_user",
                ai_model: "gemini-model-placeholder",
                user_ip: ""
            },
            contents: [
                {
                    prompt: testPrompt,
                }
            ]
        });
    });

    test('should handle a non-200 API response by throwing an error', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({
                error: { message: "Invalid token provided" }
            }),
            statusText: 'Unauthorized'
        });

        await expect(client.scanRequest('test')).rejects.toThrow(
            'PrismaAirs request failed. API Message: Invalid token provided'
        );
    });
});