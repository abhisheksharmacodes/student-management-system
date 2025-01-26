// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADq-J-Z6X1dW40V88J_PsGP9eCeN-E5-s",
  authDomain: "students-cfc4e.firebaseapp.com",
  projectId: "students-cfc4e",
  storageBucket: "students-cfc4e.firebasestorage.app",
  messagingSenderId: "729360115713",
  appId: "1:729360115713:web:c012bd9df2cc0ed5dc3800",
  measurementId: "G-FZGPWGMJ65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app