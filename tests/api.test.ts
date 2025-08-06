import { generateDesigns } from '../lib/api';
import { auth } from '../lib/firebase';

// Mock the underlying fetch function to avoid actual network calls
global.fetch = jest.fn();

// Mock Firebase auth to simulate a logged-in user
jest.mock('../lib/firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-uid',
      getIdToken: jest.fn().mockResolvedValue('test-token'),
    },
    onAuthStateChanged: jest.fn(callback => {
      // Immediately invoke the callback with a mock user
      callback({ uid: 'test-uid', getIdToken: jest.fn().mockResolvedValue('test-token') });
      // Return an unsubscribe function
      return () => {};
    }),
  },
}));

describe('API Layer - Data Transmission', () => {

  beforeEach(() => {
    // Clear mock history before each test
    (fetch as jest.Mock).mockClear();
    (auth.currentUser?.getIdToken as jest.Mock)?.mockClear();
  });

  it('should send correct raw data to the /api/generate endpoint', async () => {
    // 1. Setup: Define the raw design options from the frontend
    const designOptions = {
      length: 'Short',
      shape: 'Square',
      style: 'French',
      color: 'Pastel',
      baseColor: '#FFFFFF',
      model: 'test-model',
      width: 1024,
      height: 1024,
      num_images: 1,
    };

    // Mock the successful response from the fetch call
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: [] }),
      text: () => Promise.resolve(JSON.stringify({ success: true, data: [] })),
    });

    // 2. Act: Call the function that makes the API request
    await generateDesigns(designOptions);

    // 3. Assert: Verify that fetch was called correctly
    expect(fetch).toHaveBeenCalledTimes(1);

    const fetchCall = (fetch as jest.Mock).mock.calls[0];
    const url = fetchCall[0];
    const options = fetchCall[1];

    // Check the URL and method
    expect(url).toContain('/api/generate');
    expect(options.method).toBe('POST');

    // Check the headers
    const headers = options.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer test-token');
    expect(headers.get('Content-Type')).toBe('application/json');

    // *** This is the crucial check ***
    // Verify that the body contains the exact stringified raw data
    expect(options.body).toBe(JSON.stringify(designOptions));
  });
});
