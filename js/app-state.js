"use strict";

(function attachResQState() {
  const KEYS = {
    users: "resq_users",
    session: "resq_session",
    reports: "resq_reports"
  };

  function safeParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function getUsers() {
    return safeParse(localStorage.getItem(KEYS.users), []);
  }

  function saveUsers(users) {
    localStorage.setItem(KEYS.users, JSON.stringify(users));
  }

  function getSession() {
    return safeParse(localStorage.getItem(KEYS.session), null);
  }

  function setSession(session) {
    localStorage.setItem(KEYS.session, JSON.stringify(session));
    if (session && session.name) {
      localStorage.setItem("resq_user_name", session.name);
    }
    if (session && session.role) {
      localStorage.setItem("resq_user_role", session.role);
    }
  }

  function clearSession() {
    localStorage.removeItem(KEYS.session);
  }

  function getReports() {
    return safeParse(localStorage.getItem(KEYS.reports), []);
  }

  function saveReports(reports) {
    localStorage.setItem(KEYS.reports, JSON.stringify(reports));
  }

  function generateReportId() {
    const time = Date.now().toString().slice(-6);
    const rand = Math.floor(Math.random() * 90 + 10).toString();
    return `RP-${time}${rand}`;
  }

  function createReport(partial) {
    const report = {
      id: generateReportId(),
      createdAt: new Date().toISOString(),
      status: "reported",
      urgency: "medium",
      location: "Not provided",
      details: "",
      imageName: "",
      createdBy: {
        name: "Anonymous Reporter",
        email: ""
      },
      ...partial
    };

    const reports = getReports();
    reports.unshift(report);
    saveReports(reports);
    return report;
  }

  function updateReport(reportId, update) {
    const reports = getReports();
    const nextReports = reports.map((report) =>
      report.id === reportId ? { ...report, ...update } : report
    );
    saveReports(nextReports);
    return nextReports.find((report) => report.id === reportId) || null;
  }

  window.ResQState = {
    getUsers,
    saveUsers,
    getSession,
    setSession,
    clearSession,
    getReports,
    saveReports,
    createReport,
    updateReport
  };
})();
