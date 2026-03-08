const form = document.getElementById("createAccountForm");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const role = document.getElementById("role");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!fullName.value.trim() || !email.value.trim() || !phone.value.trim() || !role.value) {
    showToast("Please fill all required fields");
    return;
  }

  if (password.value.length < 6) {
    showToast("Password must be at least 6 characters");
    return;
  }

  if (password.value !== confirmPassword.value) {
    showToast("Passwords do not match");
    return;
  }

  if (!terms.checked) {
    showToast("Please accept terms and privacy policy");
    return;
  }

  localStorage.setItem("resq_user_name", fullName.value.trim());
  localStorage.setItem("resq_user_role", role.value);
  showToast("Account created successfully");

  setTimeout(() => {
    if (role.value === "ngo") {
      window.location.href = "ngo.html";
      return;
    }
    window.location.href = "user.html";
  }, 700);
});
