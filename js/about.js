const connectForm = document.querySelector(".connect-form");
const connectInput = document.getElementById("connect");

if (connectForm && connectInput) {
  connectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = encodeURIComponent(connectInput.value.trim());
    if (!email) {
      connectInput.focus();
      return;
    }
    window.location.href = `contact.html?email=${email}`;
  });
}
