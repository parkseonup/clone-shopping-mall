import "dotenv/config";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.firbase_apiKey,
  authDomain: process.env.firbase_authDomain,
  projectId: process.env.firbase_projectId,
  storageBucket: process.env.firbase_storageBucket,
  messagingSenderId: process.env.firbase_messagingSenderId,
  appId: process.env.firbase_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;

export const db = getFirestore(app);
