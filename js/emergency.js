const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
const photoInput = document.getElementById("photoInput");
const photoText = document.getElementById("photoText");
const locationBtn = document.getElementById("locationBtn");
const locationText = document.getElementById("locationText");
const urgencyBtn = document.getElementById("urgencyBtn");
const urgencyText = document.getElementById("urgencyText");
const reportBtn = document.getElementById("reportBtn");
const toast = document.getElementById("toast");

const draftKey = "resq_report_draft";
const draft = {
  urgency: "",
  location: "",
  imageName: ""
};

let toastTimer = null;

function saveDraft() {
  localStorage.setItem(draftKey, JSON.stringify(draft));
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1700);
}

if (uploadPhotoBtn && photoInput) {
  uploadPhotoBtn.addEventListener("click", () => photoInput.click());

  photoInput.addEventListener("change", () => {
    if (!photoInput.files || photoInput.files.length === 0) return;
    const fileName = photoInput.files[0].name;
    draft.imageName = fileName;
    saveDraft();
    if (photoText) {
      photoText.textContent = fileName.length > 20 ? `${fileName.slice(0, 20)}...` : fileName;
    }
    showToast("Photo added.");
  });
}

if (locationBtn) {
  locationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      if (locationText) {
        locationText.textContent = "Location unsupported";
      }
      showToast("Location not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lng = position.coords.longitude.toFixed(4);
        draft.location = `${lat}, ${lng}`;
        saveDraft();
        if (locationText) {
          locationText.textContent = draft.location;
        }
        showToast("Location captured.");
      },
      () => {
        const manual = prompt("Enter your area (example: Andheri East, Mumbai):", "");
        if (manual && manual.trim()) {
          draft.location = manual.trim();
          saveDraft();
          if (locationText) {
            locationText.textContent = draft.location;
          }
          showToast("Location added manually.");
        }
      }
    );
  });
}

if (urgencyBtn) {
  urgencyBtn.addEventListener("click", () => {
    const choice = prompt("Select urgency: low, medium, or critical", draft.urgency || "medium");
    if (!choice) return;

    const normalized = choice.trim().toLowerCase();
    if (!["low", "medium", "critical"].includes(normalized)) {
      showToast("Use low, medium, or critical.");
      return;
    }

    draft.urgency = normalized;
    saveDraft();
    if (urgencyText) {
      urgencyText.textContent = `Urgency: ${normalized[0].toUpperCase()}${normalized.slice(1)}`;
    }
    showToast("Urgency selected.");
  });
}

if (reportBtn) {
  reportBtn.addEventListener("click", () => {
    window.location.href = "emergency-form.html";
  });
}

function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "index.html"; // fallback page
  }
}

function goBack() {
  alert("clicked");
  window.history.back();
}