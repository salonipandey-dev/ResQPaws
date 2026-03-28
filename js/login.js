<<<<<<< ours
﻿const form = document.querySelector("form");
=======
const tabs = document.querySelectorAll(".role-tab");
const loginForm = document.getElementById("loginForm");
const emailInput = loginForm ? loginForm.querySelector('input[name="email"]') : null;
const passwordInput = loginForm ? loginForm.querySelector('input[name="password"]') : null;
const toast = document.getElementById("toast");
>>>>>>> theirs

form.addEventListener("submit", async (e) => {
  e.preventDefault();

<<<<<<< ours
  const email = document.querySelector("input[type='email']").value;
  const password = document.querySelector("input[type='password']").value;
=======
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
>>>>>>> theirs

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
<<<<<<< ours

    const data = await res.json();
=======
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

    if (account) {
      if (account.password !== password) {
        showMessage("Incorrect password.");
        return;
      }
>>>>>>> theirs

    console.log("Login response:", data);

<<<<<<< ours
    if (res.ok && data.success) {
      alert("Login successful 🚀");

      // 🔐 store token (VERY IMPORTANT)
      localStorage.setItem("token", data.token);

      // optional redirect
      window.location.href = "index.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});
=======
      if (window.ResQState) {
        ResQState.setSession({ name: account.name, email: account.email, role: account.role });
      }
      showMessage("Login successful (offline mode).");
      setTimeout(() => redirectByRole(account.role), 500);
      return;
    }

    showMessage("No account found. Please create an account first.");
  });
}
>>>>>>> theirs
