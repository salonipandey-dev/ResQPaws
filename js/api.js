"use strict";

(function attachResQApi() {
  const API_BASE = (localStorage.getItem("resq_api_base") || "http://localhost:5000/api").replace(/\/$/, "");

  function getToken() {
    if (!window.ResQState) return "";
    const session = ResQState.getSession();
    return session && session.token ? session.token : "";
  }

  async function request(path, options = {}) {
    const token = getToken();
    const headers = new Headers(options.headers || {});

    if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    let response;
    try {
      response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    } catch (fetchError) {
      const error = new Error("Cannot reach backend API. Start backend server and check API base URL.");
      error.status = 0;
      error.payload = null;
      throw error;
    }
    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const firstValidationMessage = data && Array.isArray(data.errors) && data.errors[0] ? data.errors[0].msg : "";
      const message = data && (data.message || data.error || firstValidationMessage)
        ? data.message || data.error || firstValidationMessage
        : `Request failed: ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.payload = data;
      throw error;
    }

    return data;
  }

  function frontendRoleToApi(role) {
    if (role === "user") return "citizen";
    return role || "citizen";
  }

  function apiRoleToFrontend(role) {
    if (role === "citizen") return "user";
    return role || "user";
  }

  function mapCase(record) {
    return {
      id: record.caseId || record._id,
      backendId: record._id,
      createdAt: record.createdAt,
      status: record.status || "reported",
      urgency: record.urgencyLevel === "high" ? "urgent" : (record.urgencyLevel || "medium"),
      location: record.address || record.city || (record.location && Array.isArray(record.location.coordinates)
        ? `${record.location.coordinates[1]}, ${record.location.coordinates[0]}`
        : "Not provided"),
      details: record.description || "",
      imageName: record.media && record.media[0] ? record.media[0].url : "",
      createdBy: {
        name: record.reportedBy && record.reportedBy.name ? record.reportedBy.name : "Anonymous Reporter",
        email: record.reportedBy && record.reportedBy.email ? record.reportedBy.email : ""
      }
    };
  }

  window.ResQApi = {
    request,
    frontendRoleToApi,
    apiRoleToFrontend,
    mapCase,
    baseUrl: API_BASE
  };
})();
