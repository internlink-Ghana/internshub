import { auth } from "./firebase-init.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault(); // 🔐 Prevent form refresh

  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Registration successful!");
      window.location.href = "login.html"; // ✅ redirect to login
    })
    .catch((error) => {
      alert("Registration failed: " + error.message);
    });
});
