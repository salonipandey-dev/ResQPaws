const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
const photoInput = document.getElementById("photoInput");
const photoText = document.getElementById("photoText");
const locationBtn = document.getElementById("locationBtn");
const locationText = document.getElementById("locationText");
const urgencyBtn = document.getElementById("urgencyBtn");
const urgencyText = document.getElementById("urgencyText");
const reportBtn = document.getElementById("reportBtn");
const toast = document.getElementById("toast");

let urgency = "";
let locationReady = false;
let photoReady = false;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 1700);
}

uploadPhotoBtn.addEventListener("click", () => photoInput.click());

photoInput.addEventListener("change", () => {
  if (!photoInput.files || photoInput.files.length === 0) {
    return;
  }
  photoReady = true;
  const fileName = photoInput.files[0].name;
  photoText.textContent = fileName.length > 20 ? `${fileName.slice(0, 20)}...` : fileName;
  showToast("Photo added");
});

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    locationText.textContent = "Location unsupported";
    showToast("Location not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      locationReady = true;
      const lat = position.coords.latitude.toFixed(3);
      const lng = position.coords.longitude.toFixed(3);
      locationText.textContent = `${lat}, ${lng}`;
      showToast("Location captured");
    },
    () => {
      const manual = prompt("Enter your area (example: Andheri East, Mumbai):", "");
      if (manual && manual.trim()) {
        locationReady = true;
        locationText.textContent = manual.trim();
        showToast("Location added manually");
      }
    }
  );
});

urgencyBtn.addEventListener("click", () => {
  const choice = prompt("Select urgency: low, medium, or critical", urgency || "medium");
  if (!choice) {
    return;
  }
  const normalized = choice.trim().toLowerCase();
  if (!["low", "medium", "critical"].includes(normalized)) {
    showToast("Use low, medium, or critical");
    return;
  }
  urgency = normalized;
  urgencyText.textContent = `Urgency: ${normalized[0].toUpperCase()}${normalized.slice(1)}`;
  showToast("Urgency selected");
});

reportBtn.addEventListener("click", () => {
  window.location.href = "emergency-form.html";
});
