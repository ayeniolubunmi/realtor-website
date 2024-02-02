// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBvQL8V4Uh0KNRveja5RYOryLj4TWond4w",
  authDomain: "realtor-app-project-e15c3.firebaseapp.com",
  projectId: "realtor-app-project-e15c3",
  storageBucket: "realtor-app-project-e15c3.appspot.com",
  messagingSenderId: "613386006233",
  appId: "1:613386006233:web:8b6b26db26a61d21de58c8"
};
// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();