import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAx69pIgLO-4rxjbf6oQ6qtgceHE4SeXX8",
  authDomain: "nursing-1bd92.firebaseapp.com",
  projectId: "nursing-1bd92",
  storageBucket: "nursing-1bd92.firebasestorage.app",
  messagingSenderId: "614441762967",
  appId: "1:614441762967:web:12ec26fa2fb2a2b247a9d2",
  measurementId: "G-6BCR2C4Q6S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);