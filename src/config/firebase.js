// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUpF5Q-cs-gYouktAXb89Fp96bBFmRTXw",
  authDomain: "devwell-4dabe.firebaseapp.com",
  projectId: "devwell-4dabe",
  storageBucket: "devwell-4dabe.firebasestorage.app",
  messagingSenderId: "192201958422",
  appId: "1:192201958422:web:20433560b9b65865948137",
  measurementId: "G-W5EK436G91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
