const form = document.getElementById("emergencyForm");
const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
const photoInput = document.getElementById("photoInput");
const photoText = document.getElementById("photoText");
const locationBtn = document.getElementById("locationBtn");
const locationText = document.getElementById("locationText");
const urgencyButtons = document.querySelectorAll(".urgency-btn");
const details = document.getElementById("reportDetails");
const toast = document.getElementById("toast");

let selectedUrgency = "urgent";
let photoAdded = false;
let locationAdded = false;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

uploadPhotoBtn.addEventListener("click", () => photoInput.click());

photoInput.addEventListener("change", () => {
  if (!photoInput.files || photoInput.files.length === 0) return;
  photoAdded = true;
  const fileName = photoInput.files[0].name;
  photoText.textContent = fileName.length > 22 ? `${fileName.slice(0, 22)}...` : fileName;
  showToast("Photo added");
});

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    const manual = prompt("Enter location (example: Andheri East, Mumbai):", "");
    if (manual && manual.trim()) {
      locationAdded = true;
      locationText.textContent = manual.trim();
      showToast("Location added");
    }
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      locationAdded = true;
      const lat = position.coords.latitude.toFixed(3);
      const lng = position.coords.longitude.toFixed(3);
      locationText.textContent = `Location: ${lat}, ${lng}`;
      showToast("Current location captured");
    },
    () => {
      const manual = prompt("Allow location failed. Enter location manually:", "");
      if (manual && manual.trim()) {
        locationAdded = true;
        locationText.textContent = manual.trim();
        showToast("Location added manually");
      }
    }
  );
});

urgencyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedUrgency = button.dataset.level;
    urgencyButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-checked", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-checked", "true");
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!photoAdded) {
    showToast("Please add a photo first");
    return;
  }

  if (!locationAdded) {
    showToast("Please add current location");
    return;
  }

  if (!details.value.trim()) {
    showToast("Please describe the condition");
    return;
  }

  showToast(`Report submitted (${selectedUrgency})`);
  form.reset();
  photoText.textContent = "Add Photo";
  locationText.textContent = "Provide location details so rescuers can find the animal.";
  selectedUrgency = "urgent";
  photoAdded = false;
  locationAdded = false;

  urgencyButtons.forEach((item) => {
    const isUrgent = item.dataset.level === "urgent";
    item.classList.toggle("active", isUrgent);
    item.setAttribute("aria-checked", isUrgent ? "true" : "false");
  });
});
