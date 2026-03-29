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
  if (selectedRole === "ngo" || selectedRole === "volunteer") {
    window.location.href = "ngo.html";
    return;
  }
  window.location.href = "user.html";
}

if (form) {
  form.addEventListener("submit", async (event) => {
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

    if (window.ResQApi) {
      try {
        const payload = await ResQApi.request("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: nameValue,
            email: emailValue,
            phone: phoneValue,
            password: password.value,
            role: ResQApi.frontendRoleToApi(roleValue)
          })
        });

        if (window.ResQState) {
          const user = payload.user || {};
          ResQState.setSession({
            name: user.name || nameValue,
            email: user.email || emailValue,
            role: ResQApi.apiRoleToFrontend(user.role || ResQApi.frontendRoleToApi(roleValue)),
            token: payload.token,
            userId: user._id || user.id || ""
          });
        }

        showToast("Account created successfully.");
        setTimeout(() => goToRolePage(roleValue), 700);
        return;
      } catch (error) {
        showToast(error.message || "Online signup failed.");
        return;
      }
    }

    showToast("API client not loaded. Please refresh and try again.");
  });
}
