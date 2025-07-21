
import 'whatwg-fetch'; // Polyfill for fetch in Node environment

describe('Frontend to Backend Connection', () => {
  it('should send a POST request to the backend and receive a success response', async () => {
    const testData = { client: 'newnails-fe', timestamp: new Date().toISOString() };
    const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000'; // Default to localhost for testing

    try {
      const response = await fetch(`${apiBaseUrl}/api/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Backend received the test request successfully!');
      expect(data.data).toEqual(testData);
    } catch (error) {
      // If the request fails, we want the test to fail with a clear message.
      console.error('API connection test failed:', error);
      throw new Error('Failed to connect to the backend API. Is the backend server running?');
    }
  });
});
