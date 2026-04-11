console.log("JS Loaded");
console.log(document.getElementById("contactForm"));

const contactForm = document.getElementById("contactForm");
const contactToast = document.getElementById("contactToast");
const emailInput = document.getElementById("email");

const params = new URLSearchParams(window.location.search);
const emailFromQuery = params.get("email");
if (emailInput && emailFromQuery) {
  emailInput.value = emailFromQuery;
}

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contactForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");

    const formData = new FormData(form);

    const data = {
    name: formData.get("username"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message")
  };

console.log(data);

    try {
      await fetch("https://script.google.com/macros/s/AKfycbywd8xgne0YB2Q27t7Y75AtVW9Y7ngpy_crc2oVxS9tX9R3gjjsXZEa7XRCV4AcRZDF/exec", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data)
      });

      alert("Message sent successfully!");
      form.reset();

    } catch (error) {
      alert("Error connecting to server!");
    }
  });

});