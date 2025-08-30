// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHSAWEffPSQlBm4EHyOl6tosShDYsANxc",
  authDomain: "chat-app-f9d85.firebaseapp.com",
  projectId: "chat-app-f9d85",
  storageBucket: "chat-app-f9d85.firebasestorage.app",
  messagingSenderId: "905338185201",
  appId: "1:905338185201:web:e26ecd74f4ff8b1a7e5050",
  measurementId: "G-VCB8HMWB9J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;