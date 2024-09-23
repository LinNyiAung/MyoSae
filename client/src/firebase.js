// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "myosae-63d88.firebaseapp.com",
  projectId: "myosae-63d88",
  storageBucket: "myosae-63d88.appspot.com",
  messagingSenderId: "891575905401",
  appId: "1:891575905401:web:1acb916cfcc353996478a8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);