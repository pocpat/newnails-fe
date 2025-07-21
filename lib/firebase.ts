
import { initializeApp } from 'firebase/app';
import { 
  initializeAuth,
  getReactNativePersistence, 
  getBrowserLocalPersistence, // Import browser persistence
  Auth, 
  Persistence 
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Conditionally get persistence based on the platform
let auth: Auth;
if (Platform.OS === 'web') {
  // For web, use browser local persistence
  auth = initializeAuth(app, {
    persistence: getBrowserLocalPersistence(),
  });
} else {
  // For React Native, use AsyncStorage
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

export { app, auth };
