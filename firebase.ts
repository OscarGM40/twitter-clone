import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBbU5q0UO3jj8Hsl88bNFXbMZg1PEl_TGY',
  authDomain: 'twitter-clone-02.firebaseapp.com',
  projectId: 'twitter-clone-02',
  storageBucket: 'twitter-clone-02.appspot.com',
  messagingSenderId: '669851825273',
  appId: '1:669851825273:web:6a68132fa851454e6a50a8',
}
// Recuerda que en Next no puedo usar initializeApp() simplemente
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };