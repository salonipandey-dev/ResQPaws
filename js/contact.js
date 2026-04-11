const contactForm = document.getElementById("contactForm");
const contactToast = document.getElementById("contactToast");
const emailInput = document.getElementById("email");

const params = new URLSearchParams(window.location.search);
const emailFromQuery = params.get("email");
if (emailInput && emailFromQuery) {
  emailInput.value = emailFromQuery;
}

if (contactForm && contactToast) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactToast.textContent = "Message sent successfully.";
    contactToast.classList.add("show");
    setTimeout(() => contactToast.classList.remove("show"), 1700);
    contactForm.reset();
  });
}
