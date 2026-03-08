const loginBtn = document.getElementById("loginBtn");
const emergencyBtn = document.getElementById("emergencyBtn");
const menuBtn = document.getElementById("menuBtn");
const quickMenu = document.getElementById("quickMenu");
const reportBtn = document.getElementById("reportBtn");
const locationBtn = document.getElementById("locationBtn");
const locationText = document.getElementById("locationText");
const trackReportLink = document.getElementById("trackReportLink");
const urgencyButtons = document.querySelectorAll(".urgency[data-urgency]");
const toast = document.getElementById("toast");
const stepsSection = document.querySelector(".steps");

const state = {
  selectedUrgency: "Medium",
  userName: localStorage.getItem("resq_user_name") || "",
  currentLocation: null,
  reports: JSON.parse(localStorage.getItem("resq_reports") || "{}")
};

let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2300);
}

function saveReports() {
  localStorage.setItem("resq_reports", JSON.stringify(state.reports));
}

function generateReportId() {
  const stamp = Date.now().toString().slice(-6);
  return `RP-${stamp}`;
}

function updateLoginLabel() {
  if (state.userName) {
    loginBtn.textContent = `Hi, ${state.userName.split(" ")[0]}`;
  }
}

function setUrgency(urgency) {
  state.selectedUrgency = urgency;
  urgencyButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.urgency === urgency);
  });
}

updateLoginLabel();

urgencyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setUrgency(button.dataset.urgency);
    showToast(`Urgency set to ${button.dataset.urgency}`);
  });
});

emergencyBtn.addEventListener("click", () => {
  window.location.href = "emergency.html";
});

menuBtn.addEventListener("click", () => {
  const isOpen = quickMenu.classList.toggle("is-open");
  quickMenu.setAttribute("aria-hidden", String(!isOpen));
});

document.addEventListener("click", (event) => {
  const clickedInsideMenu = quickMenu.contains(event.target);
  const clickedMenuButton = menuBtn.contains(event.target);
  if (!clickedInsideMenu && !clickedMenuButton) {
    quickMenu.classList.remove("is-open");
    quickMenu.setAttribute("aria-hidden", "true");
  }
});

loginBtn.addEventListener("click", () => {
  window.location.href = "login.html";
});

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showToast("Geolocation is not supported in this browser.");
    return;
  }

  locationText.textContent = "Detecting location...";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(4);
      const lng = position.coords.longitude.toFixed(4);
      state.currentLocation = { lat, lng };
      locationText.textContent = `Location: ${lat}, ${lng}`;
      showToast("Current location captured.");
    },
    () => {
      locationText.textContent = "Use My Current Location";
      showToast("Could not fetch location. Please allow location access.");
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

reportBtn.addEventListener("click", () => {
  const reportId = generateReportId();
  state.reports[reportId] = {
    urgency: state.selectedUrgency,
    status: "Alert sent to nearby NGOs",
    createdAt: new Date().toLocaleString(),
    location: state.currentLocation
      ? `${state.currentLocation.lat}, ${state.currentLocation.lng}`
      : "Not shared"
  };
  saveReports();

  if (stepsSection) {
    stepsSection.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  showToast(`Report submitted: ${reportId}`);
});

trackReportLink.addEventListener("click", (event) => {
  event.preventDefault();
  const reportId = prompt("Enter your Report ID (example: RP-123456):");
  if (!reportId) return;

  const record = state.reports[reportId.trim()];
  if (!record) {
    showToast("Report ID not found.");
    return;
  }

  showToast(`${reportId}: ${record.status} (${record.urgency})`);
});
