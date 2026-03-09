const reportNewBtn = document.getElementById("reportNewBtn");
const latestReportCard = document.getElementById("latestReportCard");
const reportList = document.getElementById("reportList");
const totalReports = document.getElementById("totalReports");
const rescuedReports = document.getElementById("rescuedReports");
const pendingReports = document.getElementById("pendingReports");
const logoutLink = document.getElementById("logoutLink");
const userToast = document.getElementById("userToast");

let toastTimer = null;

function showToast(message) {
  if (!userToast) return;
  userToast.textContent = message;
  userToast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => userToast.classList.remove("show"), 1600);
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

function displayUrgencyBadge(urgency) {
  if (urgency === "critical") return { css: "critical", text: "CRITICAL" };
  if (urgency === "urgent") return { css: "progress", text: "URGENT" };
  return { css: "rescued", text: urgency.toUpperCase() };
}

function statusTrail(status) {
  const current = status || "reported";
  const states = ["reported", "accepted", "on_the_way", "rescued"];
  const currentIndex = states.indexOf(current);

  function marker(index, label) {
    return index <= currentIndex ? `<span class="ok">&#9989; ${label}</span>` : `<span class="muted">&#9898; ${label}</span>`;
  }

  return `${marker(0, "Reported")}<span class="line"></span>${marker(1, "NGO Accepted")}<span class="line"></span>${marker(2, "On the Way")}<span class="line"></span>${marker(3, "Rescued")}`;
}

function renderLatest(report) {
  if (!latestReportCard) return;

  if (!report) {
    latestReportCard.innerHTML = "<div class='main-body'><h3>No reports yet</h3><p>Use + Report New Animal to submit your first rescue case.</p></div>";
    return;
  }

  const badge = displayUrgencyBadge(report.urgency || "urgent");
  latestReportCard.innerHTML = `
    <div class="thumb">
      <span class="badge ${badge.css}">&#9664; ${badge.text}</span>
      <img src="images/injured dog with ambulance.png" alt="Animal rescue report" />
    </div>
    <div class="main-body">
      <div class="row">
        <h3>&#128205; ${report.location}</h3>
        <span class="time"><span class="dot live"></span> ${humanTime(report.createdAt)}</span>
      </div>
      <p>${report.details}</p>
      <p class="status-line">${statusTrail(report.status)}</p>
      <p class="status-line"><span class="ok">ID: ${report.id}</span></p>
    </div>
  `;
}

function renderList(reports) {
  if (!reportList) return;

  if (reports.length <= 1) {
    reportList.innerHTML = "";
    return;
  }

  reportList.innerHTML = reports
    .slice(1)
    .map((report) => {
      const badge = displayUrgencyBadge(report.urgency || "regular");
      return `
        <article class="mini-card">
          <div class="thumb small">
            <span class="badge ${badge.css}">${badge.text}</span>
            <img src="images/injured dog with ambulance.png" alt="Animal rescue report" />
          </div>
          <div class="mini-body">
            <div class="row">
              <h4>&#128205; ${report.location}</h4>
              <span class="time"><span class="dot warn"></span> ${humanTime(report.createdAt)}</span>
            </div>
            <p>${report.details}</p>
            <p class="status-line compact">${statusTrail(report.status)}</p>
            <p class="status-line compact"><span class="ok">ID: ${report.id}</span></p>
          </div>
        </article>
      `;
    })
    .join("");
}

function updateStats(reports) {
  if (!totalReports || !rescuedReports || !pendingReports) return;
  const rescued = reports.filter((report) => report.status === "rescued").length;
  totalReports.textContent = String(reports.length);
  rescuedReports.textContent = String(rescued);
  pendingReports.textContent = String(reports.length - rescued);
}

function getUserReports() {
  if (!window.ResQState) return [];
  const session = ResQState.getSession();
  const allReports = ResQState.getReports();

  if (!session || !session.email) {
    return allReports;
  }

  const own = allReports.filter(
    (report) => report.createdBy && report.createdBy.email && report.createdBy.email === session.email
  );

  return own.length > 0 ? own : allReports;
}

function renderDashboard() {
  const reports = getUserReports();
  renderLatest(reports[0]);
  renderList(reports);
  updateStats(reports);
}

if (reportNewBtn) {
  reportNewBtn.addEventListener("click", () => {
    window.location.href = "emergency.html";
  });
}

if (logoutLink) {
  logoutLink.addEventListener("click", () => {
    if (window.ResQState) {
      ResQState.clearSession();
    }
  });
}

renderDashboard();

const params = new URLSearchParams(window.location.search);
if (params.get("new") === "1") {
  showToast("New report added to your feed.");
}
