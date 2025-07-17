import '@testing-library/jest-native/extend-expect';

// Define the global environment variables that your app expects
process.env.EXPO_OS = 'web';

jest.mock('expo-modules-core', () => ({
  ...jest.requireActual('expo-modules-core'),
  // Mock the specific properties that are causing issues
  NativeModulesProxy: {},
  requireNativeViewManager: jest.fn(),
}));
