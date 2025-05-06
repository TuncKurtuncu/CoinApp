import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const api_key =import.meta.env.VITE_FIREBASE_API_KEY;
const proje_id = import.meta.env.VITE_FIREBASE_PROJE_ID;
const sender_id =import.meta.env.VITE_SENDER_ID;
const domain = import.meta.env.VITE_DOMAIN;
const s_bucket = import.meta.env.VITE_S_BUCKET;
const app_id =import.meta.env.VITE_APP_ID;


const firebaseConfig = {
  apiKey: api_key,
  authDomain: domain,
  projectId: proje_id,
  storageBucket: s_bucket,
  messagingSenderId: sender_id,
  appId: app_id
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };