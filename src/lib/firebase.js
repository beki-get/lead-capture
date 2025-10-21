// lib/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0sEdRVEShlishzxBsK7NLs3pcWAeQ3SE",
  authDomain: "lead-capture-app-cb702.firebaseapp.com",
  projectId: "lead-capture-app-cb702",
  storageBucket: "lead-capture-app-cb702.firebasestorage.app",
  messagingSenderId: "893706931919",
  appId: "1:893706931919:web:15c525c59fd299d37671ba",
  measurementId: "G-RS83WCJDR6"

};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
