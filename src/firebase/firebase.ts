import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import "dotenv/config";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "suara-nusa.firebaseapp.com",
    projectId: "suara-nusa",
    storageBucket: "suara-nusa.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: "G-E973SW09N7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
