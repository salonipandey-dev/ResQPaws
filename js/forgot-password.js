const requestForm = document.getElementById("requestForm");
const resetForm = document.getElementById("resetForm");
const resetEmail = document.getElementById("resetEmail");
const otpInput = document.getElementById("otpInput");
const newPassword = document.getElementById("newPassword");
const confirmNewPassword = document.getElementById("confirmNewPassword");
const helperText = document.getElementById("helperText");
const toast = document.getElementById("toast");

const resetKey = "resq_password_reset";
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function createOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

if (requestForm) {
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = normalizeEmail(resetEmail.value);
    const users = window.ResQState ? ResQState.getUsers() : [];
    const exists = users.some((user) => user.email === email);

    if (!email) {
      showToast("Please enter your registered email.");
      return;
    }

    if (!exists) {
      showToast("No authorized account found with this email.");
      return;
    }

    const otp = createOtp();
    const payload = {
      email,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    };
    localStorage.setItem(resetKey, JSON.stringify(payload));

    requestForm.classList.add("hidden");
    resetForm.classList.remove("hidden");
    if (helperText) {
      helperText.textContent = `Verification code sent to ${email}. (Demo OTP: ${otp})`;
    }
    showToast("Reset code generated successfully.");
  });
}

if (resetForm) {
  resetForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const payload = JSON.parse(localStorage.getItem(resetKey) || "null");
    if (!payload) {
      showToast("Reset session expired. Request a new code.");
      return;
    }

    if (Date.now() > payload.expiresAt) {
      localStorage.removeItem(resetKey);
      showToast("OTP expired. Request a new code.");
      return;
    }

    if (otpInput.value.trim() !== payload.otp) {
      showToast("Invalid OTP code.");
      return;
    }

    if (newPassword.value.length < 6) {
      showToast("New password must be at least 6 characters.");
      return;
    }

    if (newPassword.value !== confirmNewPassword.value) {
      showToast("Passwords do not match.");
      return;
    }

    const users = window.ResQState ? ResQState.getUsers() : [];
    const nextUsers = users.map((user) =>
      user.email === payload.email ? { ...user, password: newPassword.value } : user
    );

    if (window.ResQState) {
      ResQState.saveUsers(nextUsers);
    }
    localStorage.removeItem(resetKey);
    showToast("Password reset successful. Redirecting to login.");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 900);
  });
}
