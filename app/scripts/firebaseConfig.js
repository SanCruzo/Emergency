import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAvE3CfmZLYCkmYHEKXoxFzw1HNWFOrad8',
  authDomain: 'emergency-8a562.firebaseapp.com',
  projectId: 'emergency-8a562',
  storageBucket: 'emergency-8a562.appspot.com',
  messagingSenderId: '576367702713',
  appId: '1:576367702713:android:4af714ede290f119666168',
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };