

import { auth } from './firebase';
import type { User } from 'firebase/auth';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';
console.log('Using API_BASE_URL:', API_BASE_URL);

/**
 * Awaits for the Firebase auth state to be initialized and returns the current user.
 * This is crucial to avoid race conditions where `auth.currentUser` is null.
 * @returns A promise that resolves with the User object or null if not signed in.
 */
const getInitializedUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      return resolve(auth.currentUser);
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const user = await getInitializedUser();

  if (!user) {
    throw new Error('Authentication required. No user is signed in.');
  }

  const token = await user.getIdToken(true); // Force a token refresh
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const finalOptions = {
    ...options,
    headers,
  };

  console.log('Final fetch options:', {
    url: `${API_BASE_URL}${url}`,
    method: finalOptions.method,
    headers: {
      Authorization: 'Bearer [REDACTED]',
      'Content-Type': headers.get('Content-Type'),
    },
    body: finalOptions.body,
  });

  const response = await fetch(`${API_BASE_URL}${url}`, finalOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Invalid JSON response from server' }));
    console.error('API Error Response:', errorData);
    throw new Error(errorData.error || 'Something went wrong');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}
















export async function generateDesigns(designOptions: {
  // Raw selections from the form
  length?: string;
  shape?: string;
  style?: string;
  color?: string; // This is the colorConfig from the form
  baseColor?: string;

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

export async function fetchRandomFunFact() {
  // This endpoint does not require authentication
  const response = await fetch(`${API_BASE_URL}/api/fun-facts`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Invalid JSON response' }));
    throw new Error(errorData.error || 'Failed to fetch fun fact');
  }
  return response.json();
}
