const KEYS = {
  users: "resq_users",
  session: "resq_session",
  reports: "resq_reports",
  rewards: "resq_rewards"
};

const STATUS_FLOW = ["reported", "verified", "accepted", "on_the_way", "rescued", "closed"];

function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getItem(key, fallback) {
  return safeParse(localStorage.getItem(key), fallback);
}

function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeedData() {
  const users = getUsers();
  if (users.length === 0) {
    const seededUsers = [
      {
        id: "U-1001",
        name: "Demo User",
        email: "user@resqpaws.org",
        phone: "9999999999",
        role: "user",
        password: "password123",
        createdAt: new Date().toISOString()
      },
      {
        id: "U-1002",
        name: "Demo NGO",
        email: "ngo@resqpaws.org",
        phone: "8888888888",
        role: "ngo",
        password: "password123",
        createdAt: new Date().toISOString()
      }
    ];
    setUsers(seededUsers);
  }

  const reports = getReports();
  if (reports.length === 0) {
    const seededReports = [
      {
        id: generateReportId(),
        createdAt: new Date().toISOString(),
        status: "reported",
        urgency: "critical",
        condition: "Dog with bleeding paw near market",
        details: "Injured stray near bus stop. Needs immediate medical attention.",
        location: "Andheri East, Mumbai",
        media: ["sample-case.jpg"],
        language: "en",
        aiSeverity: "Critical",
        createdBy: { name: "Demo User", email: "user@resqpaws.org", phone: "9999999999" }
      }
    ];
    setReports(seededReports);
  }
}

export function getUsers() {
  return getItem(KEYS.users, []);
}

export function setUsers(users) {
  setItem(KEYS.users, users);
}

export function createUser(payload) {
  const users = getUsers();
  const exists = users.some((u) => u.email === payload.email);
  if (exists) {
    return { ok: false, message: "Account already exists for this email." };
  }

  const user = {
    id: `U-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    ...payload
  };
  users.push(user);
  setUsers(users);
  return { ok: true, user };
}

export function findUserByEmail(email) {
  return getUsers().find((user) => user.email === email) || null;
}

export function updateUserPassword(email, nextPassword) {
  const users = getUsers();
  const next = users.map((user) => (user.email === email ? { ...user, password: nextPassword } : user));
  setUsers(next);
}

export function getSession() {
  return getItem(KEYS.session, null);
}

export function setSession(session) {
  setItem(KEYS.session, session);
}

export function clearSession() {
  localStorage.removeItem(KEYS.session);
}

export function generateReportId() {
  const stamp = Date.now().toString().slice(-6);
  const rand = Math.floor(Math.random() * 90 + 10).toString();
  return `RP-${stamp}${rand}`;
}

export function getReports() {
  const raw = getItem(KEYS.reports, []);
  if (Array.isArray(raw)) return raw;

  if (raw && typeof raw === "object") {
    return Object.entries(raw).map(([id, value]) => ({ id, ...value }));
  }
  return [];
}

export function setReports(reports) {
  setItem(KEYS.reports, reports);
}

export function createReport(payload) {
  const report = {
    id: generateReportId(),
    createdAt: new Date().toISOString(),
    status: "reported",
    urgency: "regular",
    condition: "",
    details: "",
    location: "",
    media: [],
    language: "en",
    aiSeverity: "Regular",
    createdBy: {
      name: "Anonymous",
      email: "",
      phone: ""
    },
    ...payload
  };

  const reports = getReports();
  reports.unshift(report);
  setReports(reports);
  return report;
}

export function updateReportStatus(reportId, nextStatus) {
  const reports = getReports();
  const status = STATUS_FLOW.includes(nextStatus) ? nextStatus : "reported";
  const updated = reports.map((report) => (report.id === reportId ? { ...report, status } : report));
  setReports(updated);
  return updated.find((report) => report.id === reportId) || null;
}

export function getRewards() {
  return getItem(KEYS.rewards, {});
}

export function addRewards(email, points) {
  if (!email) return;
  const rewards = getRewards();
  const current = rewards[email] || { points: 0, reports: 0, badge: "Bronze" };
  current.points += points;
  current.reports += 1;

  if (current.points >= 200) current.badge = "Platinum";
  else if (current.points >= 120) current.badge = "Gold";
  else if (current.points >= 60) current.badge = "Silver";

  rewards[email] = current;
  setItem(KEYS.rewards, rewards);
}

export function getUserReward(email) {
  const rewards = getRewards();
  return rewards[email] || { points: 0, reports: 0, badge: "Bronze" };
}

export function getStatusFlow() {
  return STATUS_FLOW;
}

ensureSeedData();
