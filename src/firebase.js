// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAFnC68uYlpYlcRG41FScws04QGFMDLi5A",
    authDomain: "kevinscapstonewebsite.firebaseapp.com",
    projectId: "kevinscapstonewebsite",
    storageBucket: "kevinscapstonewebsite.firebasestorage.app",
    messagingSenderId: "1052896952102",
    appId: "1:1052896952102:web:0b5bfdd746513a378e8be7",
    measurementId: "G-JNYRC1MQ2W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
