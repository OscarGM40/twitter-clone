import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBF3CyPIoZ3c6ns3fMh1xXs1_Atq90P81g",
  authDomain: "twitter-clone-ts-1ef4e.firebaseapp.com",
  projectId: "twitter-clone-ts-1ef4e",
  storageBucket: "twitter-clone-ts-1ef4e.appspot.com",
  messagingSenderId: "1018191144661",
  appId: "1:1018191144661:web:cbc6587b92570c9725a45c"
};

// Recuerda que en Next no puedo usar initializeApp() simplemente
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };