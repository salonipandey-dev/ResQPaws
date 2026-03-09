const tabs = document.querySelectorAll(".role-tab");
const loginForm = document.getElementById("loginForm");
const emailInput = loginForm ? loginForm.querySelector('input[name="email"]') : null;
const passwordInput = loginForm ? loginForm.querySelector('input[name="password"]') : null;
const toast = document.getElementById("toast");

let selectedRole = "user";
let toastTimer = null;

function showMessage(message) {
  if (!toast) {
    alert(message);
    return;
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function redirectByRole(role) {
  if (role === "ngo") {
    window.location.href = "ngo.html";
    return;
  }
  window.location.href = "user.html";
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    selectedRole = tab.dataset.role;
    tabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
  });
});

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!email || !password) {
      showMessage("Enter email and password.");
      return;
    }

    const users = window.ResQState ? ResQState.getUsers() : [];
    const account = users.find((user) => user.email === email);

    if (account) {
      if (account.password !== password) {
        showMessage("Incorrect password.");
        return;
      }

      if (account.role !== selectedRole && !(account.role === "volunteer" && selectedRole === "ngo")) {
        showMessage(`This account is registered as ${account.role}.`);
        return;
      }

      if (window.ResQState) {
        ResQState.setSession({ name: account.name, email: account.email, role: account.role });
      }
      showMessage("Login successful.");
      setTimeout(() => redirectByRole(account.role), 500);
      return;
    }

    if (window.ResQState) {
      ResQState.setSession({ name: "Guest User", email, role: selectedRole });
    }
    showMessage("No account found. Continuing as guest.");
    setTimeout(() => redirectByRole(selectedRole), 600);
  });
}
