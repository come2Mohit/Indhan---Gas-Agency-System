import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
import {
	getAuth,
	signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { firebaseConfig } from "../../../firebase-config.js";

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const form = document.querySelector("form");

function showAlert(message, duration = 3000) {
	const alertBox = document.getElementById("custom-alert");
	alertBox.textContent = message;
	alertBox.style.display = "block";
	setTimeout(() => {
		alertBox.style.display = "none";
	}, duration);
}

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	const email = document.getElementById("email").value.trim();
	const password = document.getElementById("password").value;

	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		localStorage.setItem("userId", user.uid);
		window.location.href = "user-dashboard.html";
	} catch (error) {
		console.error("Login error:", error);
		showAlert("Invalid email or password.");
	}
});
