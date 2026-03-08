const navItems = document.querySelectorAll(".nav-links a");
const filterTabs = document.querySelectorAll(".tabs a");
const caseCards = document.querySelectorAll(".cases-grid .case-card");
const acceptButtons = document.querySelectorAll(".case-footer button");
const ngoToast = document.getElementById("ngoToast");

function showNgoToast(message) {
  ngoToast.textContent = message;
  ngoToast.classList.add("show");
  setTimeout(() => ngoToast.classList.remove("show"), 1600);
}

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    navItems.forEach((link) => link.classList.remove("active"));
    item.classList.add("active");
  });
});

const filterMap = {
  all: () => true,
  urgent: (card) => card.dataset.status === "urgent",
  nearby: (card) => card.dataset.location === "kurla",
  completed: (card) => card.dataset.status === "completed",
};

filterTabs.forEach((tab) => {
  tab.addEventListener("click", (event) => {
    event.preventDefault();
    filterTabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    const selected = tab.dataset.filter;
    caseCards.forEach((card) => {
      const shouldShow = filterMap[selected](card);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

acceptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".case-card");
    if (!card) return;
    card.dataset.status = "completed";
    showNgoToast("Case accepted and marked completed.");
  });
});
