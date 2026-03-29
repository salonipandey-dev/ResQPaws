const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000/api";

const TOKEN_KEY = "resq_token";
const SESSION_KEY = "resq_session";

function safeParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function request(path, { method = "GET", body, token, headers = {} } = {}) {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch (error) {
    const err = new Error("Network error. Check backend server, CORS, and VITE_API_BASE_URL.");
    err.status = 0;
    err.cause = error;
    throw err;
  }

  const text = await response.text();
  const data = safeParseJSON(text);

  if (!response.ok) {
    const message =
      data?.message ||
      data?.errors?.[0]?.msg ||
      `Request failed with status ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? safeParseJSON(raw) : null;
}

export function setStoredSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function loginApi(payload) {
  return request("/auth/login", { method: "POST", body: payload });
}

export function signupApi(payload) {
  return request("/auth/register", { method: "POST", body: payload });
}

export function fetchMeApi(token) {
  return request("/auth/me", { token });
}

export function fetchCasesApi(token) {
  return request("/cases", { token });
}

export function createCaseApi(token, payload) {
  return request("/cases", { method: "POST", token, body: payload });
}

export function updateCaseStatusApi(token, caseId, payload) {
  return request(`/cases/${caseId}/status`, { method: "PATCH", token, body: payload });
}

export function fetchRewardsApi(token, userId) {
  return request(`/users/${userId}/rewards`, { token });
}

export function updateCaseApi(token, caseId, payload) {
  return request(`/cases/${caseId}`, { method: "PUT", token, body: payload });
}

export function deleteCaseApi(token, caseId) {
  return request(`/cases/${caseId}`, { method: "DELETE", token });
}
