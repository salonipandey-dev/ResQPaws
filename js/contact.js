const contactForm = document.getElementById("contactForm");
const contactToast = document.getElementById("contactToast");

if (contactForm && contactToast) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactToast.textContent = "Message sent successfully.";
    contactToast.classList.add("show");
    setTimeout(() => contactToast.classList.remove("show"), 1700);
    contactForm.reset();
  });
}
