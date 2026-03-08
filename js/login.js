const tabs = document.querySelectorAll(".role-tab");
const loginForm = document.getElementById("loginForm");
let selectedRole = "user";

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

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (selectedRole === "user") {
    window.location.href = "user.html";
    return;
  }
  window.location.href = "ngo.html";
});
