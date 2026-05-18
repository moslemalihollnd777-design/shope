// Copy this file to js/firebase-config.js and replace the placeholder values
// with your actual Firebase project credentials.
// Do NOT commit js/firebase-config.js to Git (it's ignored by .gitignore).

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE",
  measurementId: "YOUR_MEASUREMENT_ID_HERE"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

window.db = db;
window.auth = auth;
