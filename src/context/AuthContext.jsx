import { createContext, useContext, useMemo, useState } from "react";
import {
  clearSession,
  createUser,
  findUserByEmail,
  getSession,
  setSession,
  updateUserPassword
} from "../services/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(getSession());

  const login = ({ email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = findUserByEmail(normalizedEmail);

    if (!user) {
      if (role !== "user") {
        return { ok: false, message: "Authorized account required for this role." };
      }

      const guest = { name: "Guest User", email: normalizedEmail, role: "user" };
      setSession(guest);
      setSessionState(guest);
      return { ok: true, session: guest, message: "Logged in as guest user." };
    }

    if (user.password !== password) {
      return { ok: false, message: "Incorrect password." };
    }

    if (user.role !== role && !(user.role === "volunteer" && role === "ngo")) {
      return { ok: false, message: `This account is registered as ${user.role}.` };
    }

    const nextSession = { name: user.name, email: user.email, role: user.role };
    setSession(nextSession);
    setSessionState(nextSession);
    return { ok: true, session: nextSession };
  };

  const signup = (payload) => {
    const normalized = {
      ...payload,
      email: payload.email.trim().toLowerCase()
    };

    const created = createUser(normalized);
    if (!created.ok) {
      return created;
    }

    const nextSession = {
      name: created.user.name,
      email: created.user.email,
      role: created.user.role
    };
    setSession(nextSession);
    setSessionState(nextSession);

    return { ok: true, session: nextSession };
  };

  const logout = () => {
    clearSession();
    setSessionState(null);
  };

  const resetPassword = (email, nextPassword) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = findUserByEmail(normalizedEmail);
    if (!user) {
      return { ok: false, message: "No account found for this email." };
    }

    updateUserPassword(normalizedEmail, nextPassword);
    return { ok: true };
  };

  const value = useMemo(
    () => ({ session, isLoggedIn: Boolean(session), login, signup, logout, resetPassword }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
