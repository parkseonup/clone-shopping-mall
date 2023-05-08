import "dotenv/config";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import env from "./envLoader";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: env.firbase_apiKey,
  authDomain: env.firbase_authDomain,
  projectId: env.firbase_projectId,
  storageBucket: env.firbase_storageBucket,
  messagingSenderId: env.firbase_messagingSenderId,
  appId: env.firbase_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;

export const db = getFirestore(app);
