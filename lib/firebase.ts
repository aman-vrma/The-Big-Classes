// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgjJpqGQsT8khvXX7M-th3OVQ-HYXzgzM",
  authDomain: "the-big-classes.firebaseapp.com",
  projectId: "the-big-classes",
  storageBucket: "the-big-classes.firebasestorage.app",
  messagingSenderId: "874746583485",
  appId: "1:874746583485:web:0af64339d97aa82240dad4",
  measurementId: "G-TRF3G4YGTZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);