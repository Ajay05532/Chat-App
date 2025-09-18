// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getAuth, signOut } from "firebase/auth";
import {  getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { toast } from 'react-toastify';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);


const logout = async () =>{
  try{
    await signOut(auth)
  }catch (error){
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
    
  }
}


export {logout};
export default app;