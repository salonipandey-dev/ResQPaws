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
  selectedUrgency: "medium",
  session: window.ResQState ? ResQState.getSession() : null,
  currentLocation: null
};

let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2300);
}

function updateLoginLabel() {
  if (!loginBtn) return;
  if (state.session && state.session.name) {
    loginBtn.textContent = `Hi, ${state.session.name.split(" ")[0]}`;
  }
}

function setUrgency(urgency) {
  state.selectedUrgency = urgency.toLowerCase();
  urgencyButtons.forEach((button) => {
    const selected = button.dataset.urgency.toLowerCase() === state.selectedUrgency;
    button.classList.toggle("is-selected", selected);
  });
}

function formatUrgency(urgency) {
  return urgency.charAt(0).toUpperCase() + urgency.slice(1);
}

updateLoginLabel();

urgencyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setUrgency(button.dataset.urgency);
    showToast(`Urgency set to ${button.dataset.urgency}.`);
  });
});

if (emergencyBtn) {
  emergencyBtn.addEventListener("click", () => {
    window.location.href = "emergency.html";
  });
}

if (menuBtn && quickMenu) {
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
}

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });
}

if (locationBtn) {
  locationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported in this browser.");
      return;
    }

    if (locationText) {
      locationText.textContent = "Detecting location...";
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lng = position.coords.longitude.toFixed(4);
        state.currentLocation = `${lat}, ${lng}`;
        if (locationText) {
          locationText.textContent = `Location: ${state.currentLocation}`;
        }
        showToast("Current location captured.");
      },
      () => {
        if (locationText) {
          locationText.textContent = "Use My Current Location";
        }
        showToast("Could not fetch location. Please allow location access.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

if (reportBtn) {
  reportBtn.addEventListener("click", () => {
    if (!window.ResQState) {
      showToast("Unable to save report right now.");
      return;
    }

    const report = ResQState.createReport({
      urgency: state.selectedUrgency,
      location: state.currentLocation || "Location not shared",
      details: "Quick report submitted from home page.",
      status: "reported",
      createdBy: {
        name: state.session && state.session.name ? state.session.name : "Anonymous Reporter",
        email: state.session && state.session.email ? state.session.email : ""
      }
    });

    if (stepsSection) {
      stepsSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    showToast(`Report submitted: ${report.id} (${formatUrgency(report.urgency)}).`);
  });
}

if (trackReportLink) {
  trackReportLink.addEventListener("click", (event) => {
    event.preventDefault();
    const reportId = prompt("Enter your Report ID (example: RP-12345678):");
    if (!reportId || !window.ResQState) return;

    const reports = ResQState.getReports();
    const record = reports.find((report) => report.id === reportId.trim());

    if (!record) {
      showToast("Report ID not found.");
      return;
    }

    showToast(`${record.id}: ${record.status} (${formatUrgency(record.urgency)}).`);
  });
}

document.getElementById("reportBtn").addEventListener("click", () => {
  window.location.href = "login.html";
});