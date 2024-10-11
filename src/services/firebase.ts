// /src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA76-eQ_ty741J84AZUJRVeQ-WF2xiPXbk",
  authDomain: "greenviewv2.firebaseapp.com",
  projectId: "greenviewv2",
  storageBucket: "greenviewv2.appspot.com",
  messagingSenderId: "531785495551",
  appId: "1:531785495551:web:08ab7fd8c889a7271badca",
  measurementId: "G-N94JNCJXMB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);