const tabs = document.querySelectorAll(".role-tab");
const loginForm = document.getElementById("loginForm");
const emailInput = loginForm ? loginForm.querySelector('input[name="email"]') : null;
const passwordInput = loginForm ? loginForm.querySelector('input[name="password"]') : null;
const toast = document.getElementById("toast");

let toastTimer = null;
let selectedRole = "user";

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
  if (role === "ngo" || role === "volunteer") {
    window.location.href = "ngo.html";
    return;
  }
  window.location.href = "user.html";
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    selectedRole = tab.dataset.role || "user";

    tabs.forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
  });
});

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!email || !password) {
      showMessage("Enter email and password.");
      return;
    }

    if (window.ResQApi) {
      try {
        const payload = await ResQApi.request("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });

        const user = payload.user || {};
        const appRole = ResQApi.apiRoleToFrontend(user.role);
        const roleMatches = appRole === selectedRole || (appRole === "volunteer" && selectedRole === "ngo");
        if (!roleMatches) {
          showMessage(`This account is registered as ${appRole}.`);
          return;
        }

        if (window.ResQState) {
          ResQState.setSession({
            name: user.name,
            email: user.email,
            role: appRole,
            token: payload.token,
            userId: user._id || user.id || ""
          });
        }

        showMessage("Login successful.");
        setTimeout(() => redirectByRole(appRole), 500);
        return;
      } catch (error) {
        showMessage(error.message || "Login failed. Falling back to offline mode.");
      }
    }

    const users = window.ResQState ? ResQState.getUsers() : [];
    const account = users.find((user) => user.email === email);

    if (!account) {
      showMessage("No account found. Please create an account first.");
      return;
    }

    if (account.password !== password) {
      showMessage("Incorrect password.");
      return;
    }

    const roleMatches = account.role === selectedRole || (account.role === "volunteer" && selectedRole === "ngo");
    if (!roleMatches) {
      showMessage(`This account is registered as ${account.role}.`);
      return;
    }

    if (window.ResQState) {
      ResQState.setSession({
        name: account.name,
        email: account.email,
        role: account.role
      });
    }

    showMessage("Login successful (offline mode).");
    setTimeout(() => redirectByRole(account.role), 500);
  });
}
