const navItems = document.querySelectorAll(".nav-links a[data-nav]");
const filterTabs = document.querySelectorAll(".tabs a");
const featuredCase = document.getElementById("featuredCase");
const caseList = document.getElementById("caseList");
const ngoToast = document.getElementById("ngoToast");
const ngoLogout = document.getElementById("ngoLogout");

let currentFilter = "all";
let toastTimer = null;

function showNgoToast(message) {
  if (!ngoToast) return;
  ngoToast.textContent = message;
  ngoToast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ngoToast.classList.remove("show"), 1600);
}

function humanTime(dateString) {
  const createdAt = new Date(dateString).getTime();
  const diffMs = Date.now() - createdAt;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function badgeForUrgency(urgency) {
  if (urgency === "critical") return { css: "critical", text: "CRITICAL" };
  if (urgency === "urgent") return { css: "progress", text: "URGENT" };
  return { css: "medium", text: urgency.toUpperCase() };
}

function nextStatus(status) {
  if (status === "reported") return "accepted";
  if (status === "accepted") return "on_the_way";
  if (status === "on_the_way") return "rescued";
  return "rescued";
}

function statusLabel(status) {
  if (status === "reported") return "Accept Case";
  if (status === "accepted") return "Mark On The Way";
  if (status === "on_the_way") return "Mark Rescued";
  return "Completed";
}

function trackText(status) {
  if (status === "reported") return "Reported, waiting for NGO acceptance.";
  if (status === "accepted") return "NGO accepted and preparing response.";
  if (status === "on_the_way") return "Rescue team is on the way.";
  return "Animal rescued and case completed.";
}

function isVisible(report) {
  if (currentFilter === "all") return true;
  if (currentFilter === "urgent") return report.urgency === "urgent" || report.urgency === "critical";
  if (currentFilter === "nearby") return (report.location || "").toLowerCase().includes("mumbai");
  if (currentFilter === "completed") return report.status === "rescued";
  return true;
}

function getReports() {
  if (!window.ResQState) return [];
  return ResQState.getReports().filter((report) => isVisible(report));
}

function renderCaseContent(report, isLarge) {
  const badge = badgeForUrgency(report.urgency || "urgent");
  return `
    <div class="case-image-wrap ${isLarge ? "" : "small"}">
      <span class="badge ${badge.css}">${badge.text}</span>
      <img src="images/injured dog with ambulance.png" alt="Animal case" />
    </div>
    <div class="case-body">
      <div class="row">
        <h3>&#128205; ${report.location}</h3>
        <span class="time"><span class="dot live"></span> ${humanTime(report.createdAt)}</span>
      </div>
      <p>${report.details}</p>
      <p class="track"><span class="done">ID: ${report.id}</span><span class="line muted"></span><span>${trackText(report.status)}</span></p>
    </div>
    <div class="case-footer">
      <button type="button" data-action="progress" data-id="${report.id}" ${report.status === "rescued" ? "disabled" : ""}>${statusLabel(report.status)}</button>
    </div>
  `;
}

function renderCases() {
  if (!featuredCase || !caseList) return;

  const reports = getReports();

  if (reports.length === 0) {
    featuredCase.innerHTML = "<div class='case-body'><h3>No cases in this view</h3><p>Try another filter to see incoming reports.</p></div>";
    caseList.innerHTML = "";
    return;
  }

  featuredCase.innerHTML = renderCaseContent(reports[0], true);
  featuredCase.dataset.id = reports[0].id;
  featuredCase.dataset.status = reports[0].status;

  const rest = reports
    .slice(1)
    .map((report, index) => {
      const rowClass = index % 3 === 2 ? " row-card" : "";
      return `
        <article class="case-card${rowClass}" data-id="${report.id}" data-status="${report.status}">
          ${renderCaseContent(report, false)}
        </article>
      `;
    })
    .join("");

  caseList.innerHTML = rest;

  bindCaseActions();
}

function bindCaseActions() {
  const buttons = document.querySelectorAll("button[data-action='progress']");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const reportId = button.dataset.id;
      if (!reportId || !window.ResQState) return;

      const reports = ResQState.getReports();
      const report = reports.find((item) => item.id === reportId);
      if (!report) return;

      const updated = ResQState.updateReport(reportId, { status: nextStatus(report.status) });
      if (updated) {
        showNgoToast(`Case ${updated.id} moved to ${updated.status.replaceAll("_", " ")}.`);
      }
      renderCases();
    });
  });
}

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    navItems.forEach((link) => link.classList.remove("active"));
    item.classList.add("active");
  });
});

filterTabs.forEach((tab) => {
  tab.addEventListener("click", (event) => {
    event.preventDefault();
    filterTabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    currentFilter = tab.dataset.filter || "all";
    renderCases();
  });
});

if (ngoLogout) {
  ngoLogout.addEventListener("click", () => {
    if (window.ResQState) {
      ResQState.clearSession();
    }
  });
}

renderCases();
