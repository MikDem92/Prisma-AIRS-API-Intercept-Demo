import { PrismaAirs } from './prismaAirs.js';
// Mock uuid before the test to ensure consistent tr_id for snapshot testing
jest.mock('uuid', () => ({
    v4: () => 'mock-tr-id-0001'
}));

// Mock the global fetch function used by the PrismaAirs client
global.fetch = jest.fn();

describe('PrismaAirs Client Integration and Payload Structure', () => {
    // Read configuration from environment variables (set by GitHub Actions secrets)
    // NOTE: If these are undefined (i.e., running locally without setting ENV vars),
    // this test will still run, but you should set them for true integration testing.
    const REAL_ENDPOINT = process.env.PRISMA_AIRS_ENDPOINT || 'http://fallback.endpoint';
    const REAL_API_KEY = process.env.PRISMA_AIRS_SECURITY_KEY || 'fallback_key';
    const REAL_PROFILE_ID = process.env.PRISMA_AIRS_PROFILE_ID || 'fallback_profile';

    let client;

    // Before each test, reset the fetch mock and initialize the client
    beforeEach(() => {
        jest.clearAllMocks();
        client = new PrismaAirs({
            endpoint: REAL_ENDPOINT,
            apiKey: REAL_API_KEY,
            profileId: REAL_PROFILE_ID
        });
    });

    test('should construct the correct JSON payload and use correct headers', async () => {
        // Arrange
        const testPrompt = "Please generate a secure password string.";

        // Mock a successful API response from the server
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({
                scan_result: 'CLEAN',
                tr_id: 'mock-tr-id-0001',
                // Mock a realistic successful response body here
            }),
        });

        // Act
        await client.scanRequest(testPrompt);

        // Assert: Ensure fetch was called once
        expect(fetch).toHaveBeenCalledTimes(1);

        // Extract the request options (headers and body)
        const [url, options] = fetch.mock.calls[0];

        // 1. Check the correct endpoint was called (using the real ENV value)
        expect(url).toBe(REAL_ENDPOINT);

        // 2. Check Headers
        expect(options.headers['x-pan-token']).toBe(REAL_API_KEY);

        // 3. Check Body Structure (The critical part)
        const payload = JSON.parse(options.body);

        // CRITICAL CHECK 1: Ensure 'contents' is an array
        expect(Array.isArray(payload.contents)).toBe(true);
        
        // CRITICAL CHECK 2: Ensure the real ENV values are used in the payload
        expect(payload.ai_profile).toHaveProperty('profile_id', REAL_PROFILE_ID);

        // 4. Use snapshot testing to guarantee the entire payload remains stable
        // This confirms that the structure is consistently correct across builds.
        expect(payload).toMatchSnapshot({
            tr_id: 'mock-tr-id-0001', 
        });
    });

    test('should throw a descriptive error on API failure (e.g., 401 Unauthorized)', async () => {
        // Arrange
        const mockErrorMessage = { error: { message: "Invalid API Key provided" } };
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => mockErrorMessage,
            statusText: 'Unauthorized',
        });

        // Act & Assert
        // We expect the catch block inside scanRequest to throw the error
        await expect(client.scanRequest("test prompt")).rejects.toThrow('PrismaAirs request failed. API Message: Invalid API Key provided');
    });
});