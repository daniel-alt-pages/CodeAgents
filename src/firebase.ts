import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlwvpNGRd-vjFiQZ5U6qG_EnAls10_MA8",
  authDomain: "code-agents-ultra.firebaseapp.com",
  projectId: "code-agents-ultra",
  storageBucket: "code-agents-ultra.firebasestorage.app",
  messagingSenderId: "625264591236",
  appId: "1:625264591236:web:81cdb65cc91e0e89421dd1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
