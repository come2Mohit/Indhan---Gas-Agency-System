document
	.getElementById("contact-form")
	.addEventListener("submit", function (e) {
		e.preventDefault();

		const name = document.getElementById("name");
		const number = document.getElementById("number");
		const email = document.getElementById("email");
		const message = document.getElementById("message");

		let valid = true;
		let alertMessage = "";

		if (name.value.trim() === "") {
			alertMessage += "Name is required.\n";
			valid = false;
		}

		if (number.value.trim() === "" || !/^\d{10}$/.test(number.value)) {
			alertMessage += "Enter a valid 10-digit number.\n";
			valid = false;
		}

		if (email.value.trim() === "" || !email.value.includes("@")) {
			alertMessage += "Enter a valid email address.\n";
			valid = false;
		}

		if (message.value.trim() === "") {
			alertMessage += "Message cannot be empty.\n";
			valid = false;
		}

		if (!valid) {
			alert(alertMessage);
		} else {
			alert("Message sent successfully!");
			// Here you can send the form using fetch or XMLHttpRequest if needed
			// e.target.submit(); // If you're using a real backend
		}
	});

// ========================== EmailJS Section ==========================
// emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS public key

// document
// 	.getElementById("contact-form")
// 	.addEventListener("submit", function (e) {
// 		e.preventDefault();
// 		emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", this).then(
// 			() => {
// 				alert("Message sent successfully!");
// 				this.reset();
// 			},
// 			(error) => {
// 				alert("Failed to send message: " + JSON.stringify(error));
// 			}
// 		);
// 	});

// ================ for nav logo hide on scroll ==============

const navLogo = document.querySelector(".navlogo");

window.addEventListener("scroll", function () {
	if (window.scrollY > 50) {
		navLogo.classList.add("hidden");
	} else {
		navLogo.classList.remove("hidden");
	}
});

// box21====================
function animateOnScroll(element) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("show");
				} else {
					entry.target.classList.remove("show"); // remove when out of view
				}
			});
		},
		{ threshold: 0.2 }
	);

	observer.observe(element);
}

document.querySelectorAll(".box21").forEach(animateOnScroll);
document.querySelectorAll(".detailright").forEach(animateOnScroll);
document.querySelectorAll(".box41").forEach(animateOnScroll);

// aboutdetail image ====================
function animateImageOnScroll(element) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("show");
				} else {
					entry.target.classList.remove("show");
				}
			});
		},
		{ threshold: 0.2 }
	);

	observer.observe(element);
}

animateImageOnScroll(document.querySelector(".aboutdetailimage"));
