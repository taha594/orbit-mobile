import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDV_WAU6QdmTnxXbms93i4A_dDFPI_CK08",
  authDomain: "orbit-5123a.firebaseapp.com",
  projectId: "orbit-5123a",
  storageBucket: "orbit-5123a.firebasestorage.app",
  messagingSenderId: "114279676900",
  appId: "1:114279676900:web:b198b830eb9aed0a1525f1",
  measurementId: "G-QSJMRXBWG2",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
