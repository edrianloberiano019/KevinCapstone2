// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA30EbBgxMYXqc98sCzn37F3U-63fOBmaU",
    authDomain: "kevincapstonewebsite2.firebaseapp.com",
    projectId: "kevincapstonewebsite2",
    storageBucket: "kevincapstonewebsite2.firebasestorage.app",
    messagingSenderId: "700129069157",
    appId: "1:700129069157:web:61c537620e21a3b7a95e8c",
    measurementId: "G-4L2GD8V17N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
