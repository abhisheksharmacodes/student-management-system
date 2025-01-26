import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyADq-J-Z6X1dW40V88J_PsGP9eCeN-E5-s",
  authDomain: "students-cfc4e.firebaseapp.com",
  projectId: "students-cfc4e",
  storageBucket: "students-cfc4e.firebasestorage.app",
  messagingSenderId: "729360115713",
  appId: "1:729360115713:web:c012bd9df2cc0ed5dc3800",
  measurementId: "G-FZGPWGMJ65"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
