import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAC-vScvqtdiK6KYhG3XhkXnJGck4pgZYI",
  authDomain: "info6132-lab04-4cd59.firebaseapp.com",
  projectId: "info6132-lab04-4cd59",
  storageBucket: "info6132-lab04-4cd59.appspot.com",
  messagingSenderId: "901423269432",
  appId: "1:901423269432:web:d8bf10c1aab036d1b108cd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { db, auth };
