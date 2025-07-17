import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';
import { Alert } from 'react-native';

// Mock navigation
const mockNavigate = jest.fn();

// Mock Firebase auth functions
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Mock the firebase.ts module to prevent actual Firebase initialization
jest.mock('../lib/firebase', () => ({
  auth: {},
  app: {},
  db: {},
  storage: {},
}));

// Mock Alert.alert
jest.spyOn(Alert, 'alert');

// Mock process.env.EXPO_OS
process.env.EXPO_OS = 'web';

describe('SignIn Feature (TDD)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    (Alert.alert as jest.Mock).mockClear();
  });

  it('should allow a user to sign in with valid credentials', async () => {
    // Mock signInWithEmailAndPassword to resolve successfully
    (require('firebase/auth').signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});

    const { getByTestId, getByRole } = render(<LoginScreen navigation={{ navigate: mockNavigate }} />);

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByRole('button', { name: 'Login' }));

    // This assertion will fail initially because the sign-in logic is commented out
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Welcome');
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Logged in successfully!');
    });
  });
});
