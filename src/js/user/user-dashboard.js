// ===================== Profile Popup ======================
const avatar = document.querySelector(".avatar");
const popup = document.getElementById("profilePopup");

avatar.addEventListener("click", () => {
	popup.style.display = popup.style.display === "block" ? "none" : "block";
});

window.addEventListener("click", (e) => {
	if (!popup.contains(e.target) && !avatar.contains(e.target)) {
		popup.style.display = "none";
	}
});

// ===================== Sidebar Toggle =====================
const sidebar = document.querySelector(".sidebar");
const hamburger = document.querySelector(".hamburger");
const logo = document.querySelector(".sidebar .logo");

hamburger.addEventListener("click", () => {
	sidebar.classList.toggle("show");
	logo.innerHTML = sidebar.classList.contains("show")
		? `&nbsp &nbsp &nbsp &nbsp;<img src="../../src/images/Adobe Express - file.png"> Indhan`
		: "";
});

window.addEventListener("click", (e) => {
	if (
		sidebar.classList.contains("show") &&
		!sidebar.contains(e.target) &&
		!hamburger.contains(e.target)
	) {
		sidebar.classList.remove("show");
		logo.innerHTML = "";
	}
});

// ===================== Section Navigation =====================
const sidebarItems = document.querySelectorAll(".sidebar nav ul li, .settings");
const sections = document.querySelectorAll(".section");

function showSection(sectionName) {
	sections.forEach((sec) => {
		sec.style.display = sec.classList.contains(sectionName) ? "block" : "none";
	});

	sidebarItems.forEach((item) => {
		item.classList.toggle(
			"active",
			item.getAttribute("data-target") === sectionName
		);
	});
}

document.addEventListener("DOMContentLoaded", () => {
	const savedSection = sessionStorage.getItem("activeSection") || "dashboard";
	showSection(savedSection);

	sidebarItems.forEach((item) => {
		item.addEventListener("click", () => {
			const target = item.getAttribute("data-target");
			if (!target) return;

			sessionStorage.setItem("activeSection", target);
			showSection(target);

			if (sidebar.classList.contains("show")) {
				sidebar.classList.remove("show");
				logo.innerHTML = "";
			}
		});
	});
});

// ===================== Booking Action =====================
function bookCylinder() {
	alert("Booking initiated!");
}

// ===================== Modals =====================
const editModal = document.getElementById("editModal1");
const addressModal = document.getElementById("addressModal");

editModal.style.display = "none";
addressModal.style.display = "none";

function openModal() {
	editModal.style.display = "flex";
}

function closeModal() {
	editModal.style.display = "none";
}

function openAddressModal() {
	addressModal.style.display = "flex";
}

function closeAddressModal() {
	addressModal.style.display = "none";
}

// ===================== Save Profile Placeholder =====================
function saveProfileChanges() {
	alert("Profile changes saved!");
}

// ===================== Password Change (Optional Feature) =====================
// Uncomment the block below to enable password change functionality:

/*
document.getElementById("password-change-section").style.display = "block";

const newPassword = document.getElementById("new-password");
const confirmPassword = document.getElementById("confirm-password");
const matchMsg = document.getElementById("match-msg");
const passwordSuccess = document.getElementById("password-success-section");
const passwordChange = document.getElementById("password-change-section");

function showSuccess() {
	if (
		newPassword.value.length >= 6 &&
		newPassword.value === confirmPassword.value
	) {
		passwordChange.style.display = "none";
		passwordSuccess.style.display = "block";
	} else if (newPassword.value.length < 6) {
		alert("Password length must be at least 6 characters.");
	} else {
		alert("Passwords do not match");
	}
}

function validatePassword() {
	const match =
		newPassword.value && confirmPassword.value &&
		newPassword.value === confirmPassword.value;

	matchMsg.textContent = match ? "Passwords match" : "Passwords do not match";
	matchMsg.style.color = match ? "green" : "red";
}

newPassword.addEventListener("input", validatePassword);
confirmPassword.addEventListener("input", validatePassword);
*/

// ==============search ==============
function searchInPage() {
	const query = document.getElementById("searchInput").value.toLowerCase();
	const messageDiv = document.getElementById("searchMessage");
	messageDiv.textContent = ""; // Clear previous message

	// Remove old highlights
	const highlighted = document.querySelectorAll("mark");
	highlighted.forEach((mark) => {
		const parent = mark.parentNode;
		parent.replaceChild(document.createTextNode(mark.textContent), mark);
		parent.normalize();
	});

	if (!query) return;

	const bodyTextNodes = getTextNodes(document.body);
	let found = false;

	bodyTextNodes.forEach((node) => {
		const value = node.nodeValue.toLowerCase();
		let matchIndex = value.indexOf(query);

		if (matchIndex !== -1) {
			found = true;

			const originalValue = node.nodeValue;
			const parent = node.parentNode;

			const fragments = [];
			let lastIndex = 0;

			while (matchIndex !== -1) {
				// Add text before match
				fragments.push(
					document.createTextNode(originalValue.slice(lastIndex, matchIndex))
				);

				// Create mark element for match
				const mark = document.createElement("mark");
				mark.textContent = originalValue.slice(
					matchIndex,
					matchIndex + query.length
				);
				fragments.push(mark);

				lastIndex = matchIndex + query.length;
				matchIndex = value.indexOf(query, lastIndex);
			}

			// Add remaining text after last match
			fragments.push(document.createTextNode(originalValue.slice(lastIndex)));

			// Replace the text node with fragments
			fragments.forEach((f) => parent.insertBefore(f, node));
			parent.removeChild(node);
		}
	});

	if (found) {
		const firstMatch = document.querySelector("mark");
		if (firstMatch) {
			firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}

	if (!found) {
		messageDiv.textContent = "No result found.";
	}
}

function getTextNodes(element) {
	const walker = document.createTreeWalker(
		element,
		NodeFilter.SHOW_TEXT,
		{
			acceptNode: function (node) {
				return node.parentNode.nodeName !== "SCRIPT" &&
					node.parentNode.nodeName !== "STYLE" &&
					node.nodeValue.trim() !== ""
					? NodeFilter.FILTER_ACCEPT
					: NodeFilter.FILTER_SKIP;
			},
		},
		false
	);
	const nodes = [];
	let node;
	while ((node = walker.nextNode())) {
		nodes.push(node);
	}
	return nodes;
}
