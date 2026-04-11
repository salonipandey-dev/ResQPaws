const form = document.getElementById("emergencyForm");
const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
const photoInput = document.getElementById("photoInput");
const photoText = document.getElementById("photoText");
const locationBtn = document.getElementById("locationBtn");
const locationText = document.getElementById("locationText");
const urgencyButtons = document.querySelectorAll(".urgency-btn");
const details = document.getElementById("reportDetails");
const reportLanguage = document.getElementById("reportLanguage");
const severityText = document.getElementById("severityText");
const firstAidText = document.getElementById("firstAidText");
const toast = document.getElementById("toast");

const draftKey = "resq_report_draft";
const rewardKey = "resq_rewards";
const draft = JSON.parse(localStorage.getItem(draftKey) || "{}");
const session = window.ResQState ? window.ResQState.getSession() : null;

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
  if (reportLanguage && draft.language) {
    reportLanguage.value = draft.language;
  }

  urgencyButtons.forEach((item) => {
    const active = item.dataset.level === selectedUrgency;
    item.classList.toggle("active", active);
    item.setAttribute("aria-checked", active ? "true" : "false");
  });
}

function setUrgency(level) {
  selectedUrgency = level;
  draft.urgency = level;
  localStorage.setItem(draftKey, JSON.stringify(draft));

  urgencyButtons.forEach((item) => {
    const active = item.dataset.level === selectedUrgency;
    item.classList.toggle("active", active);
    item.setAttribute("aria-checked", active ? "true" : "false");
  });
}

function detectSeverity(text) {
  const lower = text.toLowerCase();
  const criticalWords = ["bleeding", "blood", "fracture", "hit", "accident", "unconscious"];
  const urgentWords = ["limping", "weak", "wound", "injured", "pain", "crying"];

  if (criticalWords.some((word) => lower.includes(word))) {
    return {
      level: "critical",
      label: "Critical",
      aid: "Keep distance, avoid force-moving the animal, call nearest NGO immediately, and control external bleeding only if safe."
    };
  }

  if (urgentWords.some((word) => lower.includes(word))) {
    return {
      level: "urgent",
      label: "Urgent",
      aid: "Keep area calm, provide shade/water if safe, avoid feeding unknown medication, and wait for responder guidance."
    };
  }

  return {
    level: "regular",
    label: "Regular",
    aid: "Observe from safe distance, share clear location and photo, and monitor for worsening condition."
  };
}

function updateAiGuidance() {
  if (!details) return;
  const prediction = detectSeverity(details.value.trim());
  if (severityText) {
    severityText.textContent = `AI Severity Prediction: ${prediction.label}`;
  }
  if (firstAidText) {
    firstAidText.textContent = prediction.aid;
  }

  if (!draft.urgency) {
    setUrgency(prediction.level);
  }
}

function normalizeText(text) {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function isLikelyDuplicate(reports, location, text) {
  const normalizedLocation = normalizeText(location);
  const normalizedText = normalizeText(text).slice(0, 40);
  const oneHourMs = 60 * 60 * 1000;

  return reports.some((report) => {
    const timeGap = Date.now() - new Date(report.createdAt).getTime();
    const similarLocation = normalizeText(report.location || "") === normalizedLocation;
    const similarText = normalizeText(report.details || "").slice(0, 40) === normalizedText;
    return timeGap <= oneHourMs && similarLocation && similarText;
  });
}

function addRewards() {
  if (!session || !session.email) return;

  const rewards = JSON.parse(localStorage.getItem(rewardKey) || "{}");
  const current = rewards[session.email] || { points: 0, reports: 0, badge: "Bronze" };
  current.points += 10;
  current.reports += 1;

  if (current.points >= 200) current.badge = "Platinum";
  else if (current.points >= 120) current.badge = "Gold";
  else if (current.points >= 60) current.badge = "Silver";

  rewards[session.email] = current;
  localStorage.setItem(rewardKey, JSON.stringify(rewards));
}

hydrateDraft();
updateAiGuidance();

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
    setUrgency(button.dataset.level);
  });
});

if (reportLanguage) {
  reportLanguage.addEventListener("change", () => {
    draft.language = reportLanguage.value;
    localStorage.setItem(draftKey, JSON.stringify(draft));
  });
}

if (details) {
  details.addEventListener("input", updateAiGuidance);
}

if (form) {
  form.addEventListener("submit", async (event) => {
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

    const allReports = window.ResQState.getReports();
    const duplicate = isLikelyDuplicate(allReports, draft.location || "", details.value.trim());
    if (duplicate) {
      const proceed = confirm("A similar report was recently filed at this location. Submit anyway?");
      if (!proceed) {
        showToast("Potential duplicate avoided.");
        return;
      }
    }

    const localReportPayload = {
      urgency: selectedUrgency,
      location: draft.location || "Not provided",
      details: details.value.trim(),
      language: reportLanguage ? reportLanguage.value : "en",
      imageName: draft.imageName || "",
      status: "reported",
      createdBy: {
        name: session && session.name ? session.name : "Anonymous Reporter",
        email: session && session.email ? session.email : ""
      }
    };

    if (window.ResQApi && session && session.token) {
      try {
        const urgencyMap = { regular: "low", urgent: "high", critical: "critical" };
        const formData = new FormData();
        formData.append("animalType", "dog");
        formData.append("description", details.value.trim());
        formData.append("urgencyLevel", urgencyMap[selectedUrgency] || "medium");

        const rawLocation = (draft.location || "").trim();
        const coordMatch = rawLocation.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
        const latitude = coordMatch ? coordMatch[1] : "19.0760";
        const longitude = coordMatch ? coordMatch[2] : "72.8777";

        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("address", rawLocation || "Location shared by reporter");
        formData.append("city", "Mumbai");
        formData.append("conditionTags", JSON.stringify([selectedUrgency]));
        formData.append("originalLanguage", reportLanguage ? reportLanguage.value : "en");

        if (photoInput && photoInput.files && photoInput.files[0]) {
          formData.append("media", photoInput.files[0]);
        }

        const response = await window.ResQApi.request("/cases", { method: "POST", body: formData });
        const apiCase = response && response.data ? response.data : null;

        localReportPayload.id = apiCase && apiCase.caseId ? apiCase.caseId : undefined;
        localReportPayload.backendId = apiCase && apiCase._id ? apiCase._id : undefined;

        const report = window.ResQState.createReport(localReportPayload);
        addRewards();
        localStorage.removeItem(draftKey);
        showToast(`Report submitted: ${report.id}`);

        setTimeout(() => {
          window.location.href = session ? "user.html?new=1" : "index.html";
        }, 900);
        return;
      } catch (error) {
        showToast(error.message || "Online submission failed. Saved offline.");
      }
    }

    const report = window.ResQState.createReport(localReportPayload);
    addRewards();
    localStorage.removeItem(draftKey);
    showToast(`Report submitted: ${report.id}`);

    setTimeout(() => {
      window.location.href = session ? "user.html?new=1" : "index.html";
    }, 900);
  });
}

 feature/contact-form-integration
function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "index.html"; 
  }
}
