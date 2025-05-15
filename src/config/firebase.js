// Import the functions you need from the SDKs you need
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET
} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { CACHE_SIZE_UNLIMITED, initializeFirestore } from 'firebase/firestore';
import { Alert } from 'react-native';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

console.log('Firebase config initialized with project ID:', FIREBASE_PROJECT_ID);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore with settings optimized for React Native
const db = initializeFirestore(app, {
  localCache: {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  },
  // Use only one of these, not both
  experimentalForceLongPolling: true, // Better for React Native
  useFetchStreams: false // Better for React Native
});

// Set up error handling specific to connectivity issues
const handleFirebaseNetworkError = (error) => {
  console.error('Firebase connectivity issue:', error);
  
  if (!global._hasShownFirebaseNetworkError) {
    Alert.alert(
      'Connection Issue',
      'There seems to be a problem connecting to our servers. Some features may be limited while offline.',
      [{ text: 'OK' }]
    );
    global._hasShownFirebaseNetworkError = true;
  }
};

// Listen for Firestore network state changes if needed
// This is optional but can help with better error handling
try {
  // Simple network state tracking
  global._firebaseOffline = false;
  
  // Network state listener would go here if we had an API for it
  // React Native doesn't support the normal Firestore network listener
} catch (error) {
  console.log('Could not set up network status listener:', error);
}

// No need for enableIndexedDbPersistence as it's not supported in React Native
// Just export the configured instances
export { app, auth, db, handleFirebaseNetworkError };
