const navItems = document.querySelectorAll(".nav-links a[data-nav]");
const filterTabs = document.querySelectorAll(".tabs a");
const featuredCase = document.getElementById("featuredCase");
const caseList = document.getElementById("caseList");
const ngoToast = document.getElementById("ngoToast");
const ngoLogout = document.getElementById("ngoLogout");

let currentFilter = "all";
let toastTimer = null;
let caseCache = [];

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
  if (urgency === "urgent" || urgency === "high") return { css: "progress", text: "URGENT" };
  return { css: "medium", text: urgency.toUpperCase() };
}

function nextStatus(status) {
  if (status === "reported") return "verified";
  if (status === "verified") return "accepted";
  if (status === "accepted") return "on_the_way";
  if (status === "on_the_way") return "rescued";
  if (status === "rescued") return "closed";
  return "closed";
}

function statusLabel(status) {
  if (status === "reported") return "Verify Case";
  if (status === "verified") return "Accept Case";
  if (status === "accepted") return "Mark On The Way";
  if (status === "on_the_way") return "Mark Rescued";
  if (status === "rescued") return "Close Case";
  return "Completed";
}

function trackText(status) {
  if (status === "reported") return "Reported, waiting for NGO acceptance.";
  if (status === "verified") return "Case verified with media/location details.";
  if (status === "accepted") return "NGO accepted and preparing response.";
  if (status === "on_the_way") return "Rescue team is on the way.";
  if (status === "rescued") return "Animal rescued. Pending closure formalities.";
  return "Case closed with final status log.";
}

function isVisible(report) {
  if (currentFilter === "all") return true;
  if (currentFilter === "urgent") return report.urgency === "urgent" || report.urgency === "critical";
  if (currentFilter === "nearby") return (report.location || "").toLowerCase().includes("mumbai");
  if (currentFilter === "completed") return report.status === "rescued" || report.status === "closed";
  return true;
}

function getReports() {
  return caseCache.filter((report) => isVisible(report));
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
      <button type="button" data-action="progress" data-id="${report.id}" ${report.status === "closed" ? "disabled" : ""}>${statusLabel(report.status)}</button>
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

  const rest = reports
    .slice(1)
    .map((report, index) => {
      const rowClass = index % 3 === 2 ? " row-card" : "";
      return `
        <article class="case-card${rowClass}">
          ${renderCaseContent(report, false)}
        </article>
      `;
    })
    .join("");

  caseList.innerHTML = rest;

  bindCaseActions();
}

async function updateStatus(report, status) {
  if (window.ResQApi && report.backendId) {
    try {
      await ResQApi.request(`/cases/${report.backendId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      if (window.ResQState) {
        ResQState.updateReport(report.id, { status });
      }
      return true;
    } catch (error) {
      showNgoToast(error.message || "Status update failed on backend. Updated locally.");
    }
  }

  if (window.ResQState) {
    ResQState.updateReport(report.id, { status });
  }
  return true;
}

function bindCaseActions() {
  const buttons = document.querySelectorAll("button[data-action='progress']");
  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const reportId = button.dataset.id;
      if (!reportId) return;

      const report = caseCache.find((item) => item.id === reportId);
      if (!report) return;

      const status = nextStatus(report.status);
      const ok = await updateStatus(report, status);
      if (ok) {
        report.status = status;
        showNgoToast(`Case ${report.id} moved to ${status.replaceAll("_", " ")}.`);
        renderCases();
      }
    });
  });
}

async function loadCases() {
  if (window.ResQApi && window.ResQState) {
    const session = ResQState.getSession();
    if (session && session.token) {
      try {
        const response = await ResQApi.request("/cases");
        const remote = (response.data || []).map(ResQApi.mapCase);
        const local = ResQState.getReports();
        const seen = new Set(remote.map((item) => item.id));
        caseCache = [...remote, ...local.filter((item) => !seen.has(item.id))]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        renderCases();
        return;
      } catch (error) {
        showNgoToast(error.message || "Could not load backend cases. Showing local data.");
      }
    }
  }

  caseCache = window.ResQState ? ResQState.getReports() : [];
  renderCases();
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

loadCases();
