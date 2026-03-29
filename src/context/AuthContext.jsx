import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearStoredSession,
  clearStoredToken,
  fetchMeApi,
  getStoredSession,
  getStoredToken,
  loginApi,
  setStoredSession,
  setStoredToken,
  signupApi,
} from "../services/api";

const AuthContext = createContext(null);

function normalizeRole(roleInput) {
  return roleInput === "user" ? "citizen" : roleInput;
}

function canAccessRole(tabRole, userRole) {
  if (tabRole === "user") return userRole === "citizen";
  if (tabRole === "ngo") return ["ngo", "volunteer"].includes(userRole);
  return true;
}

function buildSession(user, token) {
  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    rescuePoints: user.rescuePoints || 0,
    badges: user.badges || [],
    token,
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getStoredSession());
  const [token, setToken] = useState(getStoredToken());
  const [authLoading, setAuthLoading] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    const hydrate = async () => {
      const storedToken = getStoredToken();
      if (!storedToken) {
        setAuthLoading(false);
        return;
      }

      try {
        const me = await fetchMeApi(storedToken);
        const nextSession = buildSession(me.user, storedToken);
        setSession(nextSession);
        setToken(storedToken);
        setStoredSession(nextSession);
      } catch {
        clearStoredSession();
        clearStoredToken();
        setSession(null);
        setToken(null);
      } finally {
        setAuthLoading(false);
      }
    };

    hydrate();
  }, []);

  const login = async ({ email, password, role }) => {
    try {
      const result = await loginApi({ email: email.trim().toLowerCase(), password });
      const userRole = result.user?.role;

      if (!canAccessRole(role, userRole)) {
        return { ok: false, message: `This account is registered as ${userRole}.` };
      }

      const nextSession = buildSession(result.user, result.token);
      setSession(nextSession);
      setToken(result.token);
      setStoredToken(result.token);
      setStoredSession(nextSession);
      return { ok: true, session: nextSession, message: "Login successful." };
    } catch (error) {
      return { ok: false, message: error.message || "Unable to login." };
    }
  };

  const signup = async (payload) => {
    try {
      const result = await signupApi({
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone?.trim(),
        role: normalizeRole(payload.role),
        password: payload.password,
      });

      const nextSession = buildSession(result.user, result.token);
      setSession(nextSession);
      setToken(result.token);
      setStoredToken(result.token);
      setStoredSession(nextSession);

      return { ok: true, session: nextSession };
    } catch (error) {
      return { ok: false, message: error.message || "Unable to create account." };
    }
  };

  const logout = () => {
    clearStoredSession();
    clearStoredToken();
    setSession(null);
    setToken(null);
  };

  const resetPassword = () => {
    return {
      ok: false,
      message: "Password reset API is not connected yet. We can add backend endpoint in Step 5/7.",
    };
  };

  const value = useMemo(
    () => ({
      session,
      token,
      authLoading,
      isLoggedIn: Boolean(session && token),
      login,
      signup,
      logout,
      resetPassword,
    }),
    [session, token, authLoading]
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
