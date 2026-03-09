const kpiGrid = document.getElementById("kpiGrid");
const statusRows = document.getElementById("statusRows");
const leaderboard = document.getElementById("leaderboard");
const adminLogout = document.getElementById("adminLogout");
const adminToast = document.getElementById("adminToast");

let toastTimer = null;

function showToast(message) {
  if (!adminToast) return;
  adminToast.textContent = message;
  adminToast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => adminToast.classList.remove("show"), 1600);
}

function getReports() {
  if (!window.ResQState) return [];
  return ResQState.getReports();
}

function formatPercent(n, total) {
  if (!total) return "0%";
  return `${Math.round((n / total) * 100)}%`;
}

function renderKpis(reports) {
  const closed = reports.filter((report) => report.status === "closed").length;
  const urgent = reports.filter((report) => ["urgent", "critical"].includes(report.urgency)).length;
  const verified = reports.filter((report) => ["verified", "accepted", "on_the_way", "rescued", "closed"].includes(report.status)).length;

  const cards = [
    { title: "Total Cases", value: reports.length },
    { title: "High Priority", value: urgent },
    { title: "Verification Rate", value: formatPercent(verified, reports.length) },
    { title: "Closed Cases", value: closed }
  ];

  if (kpiGrid) {
    kpiGrid.innerHTML = cards
      .map(
        (card) => `
          <article class="kpi">
            <h3>${card.title}</h3>
            <p>${card.value}</p>
          </article>
        `
      )
      .join("");
  }
}

function renderStatusRows(reports) {
  const statuses = ["reported", "verified", "accepted", "on_the_way", "rescued", "closed"];
  if (!statusRows) return;

  statusRows.innerHTML = statuses
    .map((status) => {
      const count = reports.filter((report) => report.status === status).length;
      return `
        <div class="status-row">
          <strong>${status.replaceAll("_", " ").toUpperCase()}</strong>
          <span class="count">${count}</span>
        </div>
      `;
    })
    .join("");
}

function renderLeaderboard(reports) {
  if (!leaderboard) return;

  const byUser = {};
  reports.forEach((report) => {
    const key = (report.createdBy && report.createdBy.name) || "Anonymous Reporter";
    byUser[key] = (byUser[key] || 0) + 1;
  });

  const leaders = Object.entries(byUser)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  if (leaders.length === 0) {
    leaderboard.innerHTML = "<p>No contribution data yet.</p>";
    return;
  }

  leaderboard.innerHTML = leaders
    .map(
      ([name, reportsCount], idx) => `
        <div class="leader">
          <span>#${idx + 1} ${name}</span>
          <span class="count">${reportsCount} reports</span>
        </div>
      `
    )
    .join("");
}

function render() {
  const reports = getReports();
  renderKpis(reports);
  renderStatusRows(reports);
  renderLeaderboard(reports);
}

if (adminLogout) {
  adminLogout.addEventListener("click", () => {
    if (window.ResQState) {
      ResQState.clearSession();
    }
    showToast("Logged out.");
  });
}

render();
