const form = document.getElementById("createAccountForm");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const role = document.getElementById("role");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");
const toast = document.getElementById("toast");

let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function goToRolePage(selectedRole) {
  if (selectedRole === "admin") {
    window.location.href = "admin.html";
    return;
  }
  if (selectedRole === "ngo") {
    window.location.href = "ngo.html";
    return;
  }
  if (selectedRole === "volunteer") {
    window.location.href = "ngo.html";
    return;
  }
  window.location.href = "user.html";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameValue = fullName.value.trim();
  const emailValue = normalizeEmail(email.value);
  const phoneValue = phone.value.trim();
  const roleValue = role.value;

  if (!nameValue || !emailValue || !phoneValue || !roleValue) {
    showToast("Please fill all required fields.");
    return;
  }

  if (!/^[0-9+\-\s]{8,15}$/.test(phoneValue)) {
    showToast("Enter a valid phone number.");
    return;
  }

  if (password.value.length < 6) {
    showToast("Password must be at least 6 characters.");
    return;
  }

  if (password.value !== confirmPassword.value) {
    showToast("Passwords do not match.");
    return;
  }

  if (!terms.checked) {
    showToast("Please accept terms and privacy policy.");
    return;
  }

  const users = window.ResQState ? ResQState.getUsers() : [];
  const exists = users.some((user) => user.email === emailValue);
  if (exists) {
    showToast("An account with this email already exists.");
    return;
  }

  users.push({
    name: nameValue,
    email: emailValue,
    phone: phoneValue,
    role: roleValue,
    password: password.value,
    createdAt: new Date().toISOString()
  });

  if (window.ResQState) {
    ResQState.saveUsers(users);
    ResQState.setSession({ name: nameValue, email: emailValue, role: roleValue });
  }

  showToast("Account created successfully.");

  setTimeout(() => {
    goToRolePage(roleValue);
  }, 700);
});
