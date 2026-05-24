import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuration from firebase-applet-config.json
const firebaseConfig = {
  projectId: "autothinker-x-landing-page",
  appId: "1:924305108190:web:bffa6c6d75f6baaa62664f",
  apiKey: "AIzaSyBgNTc3FPbszCVpo4UW__cQ2SPrS2N0NN4",
  authDomain: "autothinker-x-landing-page.firebaseapp.com",
  storageBucket: "autothinker-x-landing-page.firebasestorage.app",
  messagingSenderId: "924305108190"
};

const app = initializeApp(firebaseConfig);

// Use the specific database ID from your config
export const db = getFirestore(app, "ai-studio-6b7ec88d-4e22-48ef-9c4c-2fd67009e937");
