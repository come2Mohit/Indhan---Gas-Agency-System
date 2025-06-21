// ================= Ripple & Long Press =================
document.querySelectorAll(".box, .box2").forEach((box) => {
	// Ripple effect on click
	box.addEventListener("click", function (e) {
		const ripple = document.createElement("span");
		ripple.className = "ripple";

		const boxRect = box.getBoundingClientRect();
		const size = Math.max(box.clientWidth, box.clientHeight);
		ripple.style.width = ripple.style.height = `${size}px`;
		ripple.style.left = `${e.clientX - boxRect.left - size / 2}px`;
		ripple.style.top = `${e.clientY - boxRect.top - size / 2}px`;

		this.appendChild(ripple);
		ripple.addEventListener("animationend", () => ripple.remove());
	});

	// Long press detection
	let pressTimer;
	box.addEventListener("mousedown", () => {
		pressTimer = setTimeout(() => {
			box.classList.add("long-pressed");
			alert(`Long press activated on "${box.textContent.trim()}"`);
		}, 600); // Threshold in ms
	});
	["mouseup", "mouseleave"].forEach((event) => {
		box.addEventListener(event, () => clearTimeout(pressTimer));
	});
});

// ================= Profile Popup Toggle =================
const avatar = document.querySelector(".avatar");
const profilePopup = document.getElementById("profilePopup");

avatar.addEventListener("click", () => {
	profilePopup.style.display =
		profilePopup.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
	if (!profilePopup.contains(e.target) && !avatar.contains(e.target)) {
		profilePopup.style.display = "none";
	}
});

// Close popup on customize button click
document.querySelectorAll(".popup-customize").forEach((btn) => {
	btn.addEventListener("click", () => {
		profilePopup.style.display = "none";
	});
});

// ================= Sidebar Navigation =================
const sidebarItems = document.querySelectorAll(
	".nav-icons i, .actions i, .popup-customize, .box-click, .grid-item"
);
const sections = document.querySelectorAll(".section");

sidebarItems.forEach((item) => {
	item.addEventListener("click", () => {
		sidebarItems.forEach((el) => el.classList.remove("active"));
		item.classList.add("active");

		const target = item.getAttribute("data-target");
		sections.forEach((section) => (section.style.display = "none"));

		const targetSection = document.querySelector(`.${target}`);
		if (targetSection) {
			targetSection.style.display = target === "container" ? "flex" : "block";
		}
	});
});

// ================= Modal Handling =================
document.getElementById("editModal1").style.display = "none";
document.getElementById("addressModal").style.display = "none";

function openModal() {
	document.getElementById("editModal1").style.display = "flex";
}
function closeModal() {
	document.getElementById("editModal1").style.display = "none";
}
function openAddressModal() {
	document.getElementById("addressModal").style.display = "flex";
}
function closeAddressModal() {
	document.getElementById("addressModal").style.display = "none";
}

// ================= Password Change =================
document.getElementById("password-change-section").style.display = "block";
const newPassword = document.getElementById("new-password");
const confirmPassword = document.getElementById("confirm-password");
const matchMsg = document.getElementById("match-msg");
const passwordChange = document.getElementById("password-change-section");
const passwordSuccess = document.getElementById("password-success-section");

function validatePassword() {
	const password = newPassword.value;
	const confirm = confirmPassword.value;
	const match = password && confirm && password === confirm;

	matchMsg.textContent = match ? "Passwords match" : "Passwords do not match";
	matchMsg.style.color = match ? "green" : "red";
}

newPassword.addEventListener("input", validatePassword);
confirmPassword.addEventListener("input", validatePassword);

function showSuccess() {
	const pass = newPassword.value;
	const confirm = confirmPassword.value;

	if (pass.length >= 6 && pass === confirm) {
		passwordChange.style.display = "none";
		passwordSuccess.style.display = "block";
	} else if (pass.length < 6) {
		alert("Password length must be at least 6 characters.");
	} else {
		alert("Passwords do not match");
	}
}

// ================= DOM Session & Navigation =================
document.addEventListener("DOMContentLoaded", () => {
	const navIcons = document.querySelectorAll(".nav-icons i");
	const sections = document.querySelectorAll("main > .section");

	let lastSection = sessionStorage.getItem("activeSection");

	// If no session value yet, or it's a full page load (not back/forward), default to "container"
	const navType = performance.getEntriesByType("navigation")[0].type;
	if (!lastSection || (navType !== "back_forward" && !location.hash)) {
		lastSection = "container";
		sessionStorage.setItem("activeSection", lastSection);
		history.replaceState({ section: lastSection }, "", `#${lastSection}`);
	}

	showSection(lastSection);
	setActiveIcon(lastSection);

	navIcons.forEach((icon) => {
		icon.addEventListener("click", () => {
			const target = icon.getAttribute("data-target");
			if (target) {
				sessionStorage.setItem("activeSection", target);
				showSection(target);
				setActiveIcon(target);
			}
		});
	});

	function showSection(target) {
		sections.forEach((section) => {
			section.style.display = section.classList.contains(target)
				? target === "container"
					? "flex"
					: "block"
				: "none";
		});
	}

	function setActiveIcon(target) {
		navIcons.forEach((icon) => {
			icon.classList.toggle(
				"active",
				icon.getAttribute("data-target") === target
			);
		});
	}
});

// ================= Search Bar =================
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function removeHighlights() {
	document.querySelectorAll("mark").forEach((mark) => {
		const parent = mark.parentNode;
		parent.replaceChild(document.createTextNode(mark.textContent), mark);
		parent.normalize(); // Merge adjacent text nodes
	});
}

function highlightTerm(term) {
	const walker = document.createTreeWalker(
		document.body,
		NodeFilter.SHOW_TEXT,
		{
			acceptNode(node) {
				if (
					node.parentNode &&
					node.parentNode.nodeName !== "SCRIPT" &&
					node.parentNode.nodeName !== "STYLE" &&
					node.nodeValue.toLowerCase().includes(term.toLowerCase())
				) {
					return NodeFilter.FILTER_ACCEPT;
				}
				return NodeFilter.FILTER_REJECT;
			},
		}
	);

	let node;
	while ((node = walker.nextNode())) {
		const matchIndex = node.nodeValue.toLowerCase().indexOf(term.toLowerCase());
		if (matchIndex !== -1) {
			const matchText = node.nodeValue.substring(
				matchIndex,
				matchIndex + term.length
			);
			const before = node.nodeValue.slice(0, matchIndex);
			const after = node.nodeValue.slice(matchIndex + term.length);

			const beforeNode = document.createTextNode(before);
			const markNode = document.createElement("mark");
			markNode.textContent = matchText;
			const afterNode = document.createTextNode(after);

			const parent = node.parentNode;
			parent.replaceChild(afterNode, node);
			parent.insertBefore(markNode, afterNode);
			parent.insertBefore(beforeNode, markNode);
			break; // Stop after first match
		}
	}
}

function searchTerm() {
	const term = searchInput.value.trim();
	if (term) {
		removeHighlights();
		if (!window.find(term)) {
			alert("Oh no! We didn’t find any matches. 😫");
		} else {
			highlightTerm(term);
		}
		searchInput.value = "";
	}
}

searchBtn.addEventListener("click", searchTerm);
searchInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") searchTerm();
});

// ================= Settings Panel =================
function settingsOpen() {
	const homecontainer = document.querySelector(".container");
	const pContent = document.querySelector(".personal-content");

	if (getComputedStyle(pContent).display === "none") {
		pContent.style.display = "flex";
		void pContent.offsetWidth; // Trigger reflow
		pContent.classList.add("show");
		homecontainer.classList.add("shift-left");
	} else {
		pContent.classList.remove("show");
		homecontainer.classList.remove("shift-left");
		pContent.addEventListener("transitionend", function hideAfterTransition() {
			pContent.style.display = "none";
			pContent.removeEventListener("transitionend", hideAfterTransition);
		});
	}
}

// ================= Back Button Navigation =================
window.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".nav-icons i").forEach((icon) => {
		icon.addEventListener("click", () => {
			const target = icon.getAttribute("data-target");
			if (target) {
				history.pushState({ section: target }, "", `#${target}`);
			}
		});
	});

	window.addEventListener("popstate", (event) => {
		const section = event.state?.section || "container";
		sessionStorage.setItem("activeSection", section);
		const targetIcon = document.querySelector(
			`.nav-icons i[data-target="${section}"]`
		);
		if (targetIcon) targetIcon.click();
	});
});
