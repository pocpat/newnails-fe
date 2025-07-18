import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence, browserLocalPersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { Platform } from "react-native";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with platform-specific persistence
const auth = initializeAuth(app, {
  persistence: Platform.OS === "web" ? browserLocalPersistence : getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);

// Custom hook to wrap useAuthState for easy mocking and usage
const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);
  return { user, loading, error };
};

export { app, auth, db, storage, useAuth };