import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
	getFirestore,
	collection,
	query,
	where,
	getDocs,
	doc,
	setDoc,
	serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
	getAuth,
	createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Firebase configuration
import { firebaseConfig } from "../../../firebase-config.js";

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Handle form submission
const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
	e.preventDefault();

	// Get form values
	const name = document.getElementById("name").value.trim();
	const email = document.getElementById("email").value.trim();
	const phone = document.getElementById("phone").value.trim();
	const password = document.getElementById("password").value;
	const confirmPassword = document.getElementById("confirm-password").value;
	const gender = document.querySelector("input[name='gender']:checked")?.value;
	const role = "Customer";
	const dob = "--/--/----";
	const country = "-";
	const city = "-";
	const postal = "-";

	// Generate unique bookID and ensure it doesn't already exist
	let bookID;
	let isUnique = false;

	while (!isUnique) {
		const candidateID = crypto.randomUUID();
		const q = query(
			collection(db, "registrations"),
			where("bookID", "==", candidateID)
		);
		const snapshot = await getDocs(q);
		if (snapshot.empty) {
			bookID = candidateID;
			isUnique = true;
		}
	}

	// Basic validations
	if (!gender) {
		alert("Please select a gender.");
		return;
	}

	if (password !== confirmPassword) {
		alert("Passwords do not match.");
		return;
	}

	try {
		// Check for duplicate phone number in Firestore
		const usersRef = collection(db, "registrations");

		// Check for duplicate phone
		const phoneQuery = query(usersRef, where("phone", "==", phone));
		const phoneSnapshot = await getDocs(phoneQuery);

		// Check for duplicate email
		const emailQuery = query(usersRef, where("email", "==", email));
		const emailSnapshot = await getDocs(emailQuery);

		if (!phoneSnapshot.empty) {
			alert("User already exists with this phone number.");
			return;
		}

		if (!emailSnapshot.empty) {
			alert("User already exists with this email address.");
			return;
		}

		// Create user using Firebase Auth
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		// Store additional user info in Firestore using UID
		await setDoc(doc(db, "registrations", user.uid), {
			uid: user.uid,
			name,
			email,
			phone,
			gender,
			role,
			dob,
			country,
			city,
			postal,
			bookID,
			createdAt: serverTimestamp(),
		});

		alert("Registration successful!");
		window.location.href = "user-login.html";
	} catch (error) {
		switch (error.code) {
			case "auth/email-already-in-use":
				alert("This email is already registered.");
				break;
			case "auth/invalid-email":
				alert("Please enter a valid email.");
				break;
			case "auth/weak-password":
				alert("Password must be at least 6 characters.");
				break;
			default:
				console.error("Unexpected error:", error);
				alert("Registration failed: " + error.message);
		}
	}
});
