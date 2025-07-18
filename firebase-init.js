// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUO3TkCbwNz9OpnXABp5pg-rQlZkuFU-Y",
  authDomain: "internlink-ghana.firebaseapp.com",
  projectId: "internlink-ghana",
  storageBucket: "internlink-ghana.firebasestorage.app",
  messagingSenderId: "429020546652",
  appId: "1:429020546652:web:606aa88d107add19040899",
  measurementId: "G-9CH8GZ5J5B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
