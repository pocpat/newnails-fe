import { auth } from './firebase';
import { User } from 'firebase/auth';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Awaits for the Firebase auth state to be initialized and returns the current user.
 * This is crucial to avoid race conditions where `auth.currentUser` is null.
 * @returns A promise that resolves with the User object or null if not signed in.
 */
const getInitializedUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    // If currentUser is already available, resolve immediately
    if (auth.currentUser) {
      return resolve(auth.currentUser);
    }
    // Otherwise, wait for the auth state to change
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe(); // Unsubscribe to prevent memory leaks
      resolve(user);
    });
  });
};

async function fetchWithAuth(url: string, options?: RequestInit) {
  const user = await getInitializedUser();
  console.log('fetchWithAuth: Initialized user:', user ? user.uid : 'No user found');

  if (!user) {
    // This case should ideally be handled by UI logic (e.g., redirect to login)
    // But as a safeguard, we throw an error.
    throw new Error('Authentication required. No user is signed in.');
  }

  const token = await user.getIdToken(true); // Force a token refresh
  console.log('Firebase Token Status:', token ? 'Token successfully retrieved' : 'Token is null');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // Token is now guaranteed to exist
    ...options?.headers,
  };

  console.log('fetchWithAuth: Headers being sent:', {
    ...headers,
    Authorization: 'Bearer [REDACTED]', // Avoid logging the full token
  });

  const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Invalid JSON response from server' }));
    console.error('API Error Response:', errorData);
    throw new Error(errorData.error || 'Something went wrong');
  }

  return response.json();
}

export async function generateDesigns(designOptions: {
  prompt: string;
  model: string;
  width?: number;
  height?: number;
  num_images?: number;
}) {
  return fetchWithAuth('/api/generate', {
    method: 'POST',
    body: JSON.stringify(designOptions),
  });
}

export async function saveDesign(designData: {
  prompt: string;
  temporaryImageUrl: string;
}) {
  return fetchWithAuth('/api/save-design', {
    method: 'POST',
    body: JSON.stringify(designData),
  });
}

export async function getMyDesigns() {
  return fetchWithAuth('/api/my-designs');
}

export async function deleteDesign(designId: string) {
  return fetchWithAuth(`/api/designs/${designId}`, {
    method: 'DELETE',
  });
}

export async function toggleFavorite(designId: string) {
  return fetchWithAuth(`/api/designs/${designId}/favorite`, {
    method: 'PATCH',
  });
}
