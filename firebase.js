// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuMAvbqkINriXVDzKY7e8Iif7UoMoZ2Vc",
  authDomain: "inventory-management-app-2c550.firebaseapp.com",
  projectId: "inventory-management-app-2c550",
  storageBucket: "inventory-management-app-2c550.appspot.com",
  messagingSenderId: "986112540067",
  appId: "1:986112540067:web:1e18cfb3ad924ef0e42e16",
  measurementId: "G-CCDX6JPQ2X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}