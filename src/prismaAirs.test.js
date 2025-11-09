// Import Jest functions for ES modules
import { jest, describe, test, beforeEach, expect } from '@jest/globals';

// Mock the uuid module before importing the module under test
jest.unstable_mockModule('uuid', () => ({
    v4: jest.fn(() => 'mock-tr-id-0001')
}));

// Read configuration from environment variables (set by GitHub Actions secrets)
const MOCK_ENDPOINT = process.env.PRISMA_AIRS_ENDPOINT || 'https://mock-endpoint.example.com';
const MOCK_API_KEY = process.env.PRISMA_AIRS_SECURITY_KEY || 'mock-api-key';
const MOCK_PROFILE_ID = process.env.PRISMA_AIRS_PROFILE_ID || 'mock-profile-id';
const MOCK_MODEL_NAME = 'gemini-model-placeholder';

// FIX: Correcting the import path casing to match the file name (prismaAirs.js)
// This resolves the case-sensitivity issue on the Linux CI runner.
const { PrismaAirs } = await import('./prismaAirs.js');

// Mock the global fetch function used by the PrismaAirs client
global.fetch = jest.fn();

describe('PrismaAirs Client Integration and Payload Structure', () => {
    // Setup client with credentials from environment variables (or mock if local)
    const client = new PrismaAirs({
        endpoint: MOCK_ENDPOINT,
        apiKey: MOCK_API_KEY,
        profileId: MOCK_PROFILE_ID,
        modelName: MOCK_MODEL_NAME
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
            // Should be the mock value from jest.mock('uuid')
            tr_id: 'mock-tr-id-0001', 
            ai_profile: {
                profile_id: MOCK_PROFILE_ID
            },
            metadata: {
                app_name: "My Chat Assistant",
                ai_model: MOCK_MODEL_NAME
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