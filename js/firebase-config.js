// 1: Centralized Firebase config moved from HTML files
// This file initializes Firebase and exposes `db` and `auth` globals.
const firebaseConfig = {
    apiKey: "AIzaSyD9vKm8pAEV7RijHNxgd5B9dr1kaUS-NxA",
    authDomain: "alaa-moslem.firebaseapp.com",
    projectId: "alaa-moslem",
    storageBucket: "alaa-moslem.firebasestorage.app",
    messagingSenderId: "821066430593",
    appId: "1:821066430593:web:aa854258446e57a1ad3580",
    measurementId: "G-62TP2N0NN1"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();
window.db = db;
window.auth = auth;
