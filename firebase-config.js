import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyASqJwRuW_d4MBpIOALt6Fe-m4ZKUFloXo",
    authDomain: "cloud-digital-certificate.firebaseapp.com",
    projectId: "cloud-digital-certificate",
    storageBucket: "cloud-digital-certificate.firebasestorage.app",
    messagingSenderId: "717970254369",
    appId: "1:717970254369:web:d79b1309608f29a440d160",
    measurementId: "G-2PCLDWQGQK"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };