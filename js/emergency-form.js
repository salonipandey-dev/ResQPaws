const form = document.getElementById("emergencyForm");
const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
const photoInput = document.getElementById("photoInput");
const photoText = document.getElementById("photoText");
const locationBtn = document.getElementById("locationBtn");
const locationText = document.getElementById("locationText");
const urgencyButtons = document.querySelectorAll(".urgency-btn");
const details = document.getElementById("reportDetails");
const toast = document.getElementById("toast");

const draftKey = "resq_report_draft";
const draft = JSON.parse(localStorage.getItem(draftKey) || "{}");
const session = window.ResQState ? ResQState.getSession() : null;

let selectedUrgency = draft.urgency || "urgent";
let photoAdded = Boolean(draft.imageName);
let locationAdded = Boolean(draft.location);
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function hydrateDraft() {
  if (draft.imageName && photoText) {
    photoText.textContent = draft.imageName;
  }
  if (draft.location && locationText) {
    locationText.textContent = draft.location;
  }

  urgencyButtons.forEach((item) => {
    const active = item.dataset.level === selectedUrgency;
    item.classList.toggle("active", active);
    item.setAttribute("aria-checked", active ? "true" : "false");
  });
}

hydrateDraft();

if (uploadPhotoBtn && photoInput) {
  uploadPhotoBtn.addEventListener("click", () => photoInput.click());

  photoInput.addEventListener("change", () => {
    if (!photoInput.files || photoInput.files.length === 0) return;
    photoAdded = true;
    const fileName = photoInput.files[0].name;
    if (photoText) {
      photoText.textContent = fileName.length > 22 ? `${fileName.slice(0, 22)}...` : fileName;
    }
    draft.imageName = fileName;
    localStorage.setItem(draftKey, JSON.stringify(draft));
    showToast("Photo added.");
  });
}

if (locationBtn) {
  locationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      const manual = prompt("Enter location (example: Andheri East, Mumbai):", "");
      if (manual && manual.trim()) {
        locationAdded = true;
        draft.location = manual.trim();
        localStorage.setItem(draftKey, JSON.stringify(draft));
        if (locationText) {
          locationText.textContent = draft.location;
        }
        showToast("Location added.");
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        locationAdded = true;
        const lat = position.coords.latitude.toFixed(4);
        const lng = position.coords.longitude.toFixed(4);
        draft.location = `${lat}, ${lng}`;
        localStorage.setItem(draftKey, JSON.stringify(draft));
        if (locationText) {
          locationText.textContent = `Location: ${draft.location}`;
        }
        showToast("Current location captured.");
      },
      () => {
        const manual = prompt("Location access failed. Enter location manually:", "");
        if (manual && manual.trim()) {
          locationAdded = true;
          draft.location = manual.trim();
          localStorage.setItem(draftKey, JSON.stringify(draft));
          if (locationText) {
            locationText.textContent = draft.location;
          }
          showToast("Location added manually.");
        }
      }
    );
  });
}

urgencyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedUrgency = button.dataset.level;
    draft.urgency = selectedUrgency;
    localStorage.setItem(draftKey, JSON.stringify(draft));

    urgencyButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-checked", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-checked", "true");
  });
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!photoAdded) {
      showToast("Please add a photo first.");
      return;
    }

    if (!locationAdded) {
      showToast("Please add current location.");
      return;
    }

    if (!details || !details.value.trim()) {
      showToast("Please describe the condition.");
      return;
    }

    if (!window.ResQState) {
      showToast("Unable to submit report right now.");
      return;
    }

    const report = ResQState.createReport({
      urgency: selectedUrgency,
      location: draft.location || "Not provided",
      details: details.value.trim(),
      imageName: draft.imageName || "",
      status: "reported",
      createdBy: {
        name: session && session.name ? session.name : "Anonymous Reporter",
        email: session && session.email ? session.email : ""
      }
    });

    localStorage.removeItem(draftKey);
    showToast(`Report submitted: ${report.id}`);

    setTimeout(() => {
      window.location.href = session ? "user.html?new=1" : "index.html";
    }, 900);
  });
}
