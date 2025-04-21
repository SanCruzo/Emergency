import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyAvE3CfmZLYCkmYHEKXoxFzw1HNWFOrad8',
  authDomain: 'https://emergency-8a562.firebaseapp.com',
  projectId: 'emergency-8a562',
  storageBucket: 'emergency-8a562.appspot.com',
  messagingSenderId: '576367702713',
  appId: '1:576367702713:android:4af714ede290f119666168',
};

const app = initializeApp(firebaseConfig);
export default app;