import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
	getAuth,
	signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
	getFirestore,
	doc,
	getDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import { firebaseConfig } from "../../../firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function showAlert(message, duration = 3000) {
	const alertBox = document.getElementById("custom-alert");
	alertBox.textContent = message;
	alertBox.style.display = "block";
	setTimeout(() => {
		alertBox.style.display = "none";
	}, duration);
}

const form = document.querySelector("form");

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
		const uid = user.uid;

		// 🔍 Check if the user is registered as an admin
		const adminDocRef = doc(db, "registrations", uid);
		const adminDocSnap = await getDoc(adminDocRef);

		if (adminDocSnap.exists()) {
			const adminData = adminDocSnap.data();
			if (adminData.role === "Admin") {
				// ✅ User is an admin
				localStorage.setItem("userId", uid);
				window.location.href = "admin-dashboard.html"; //✅ CORRECT
				// window.location.replace("admin-dashboard.html"); // ✅ CORRECT
			} else {
				// ❌ Role is not admin
				alert("Access denied: You are not an admin.");
			}
		} else {
			// ❌ No admin document found
			alert("Access denied: Admin data not found.");
		}
	} catch (error) {
		console.error("Login failed:", error.code, error.message);
		showAlert("Login failed: Invalid email or password.");
	}
});
