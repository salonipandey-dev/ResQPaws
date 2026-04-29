import axios, { AxiosError } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("resqpaws_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const getApiErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || "Something went wrong. Please try again.";
};

export type AuthPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = AuthPayload & {
  name: string;
  role?: "user" | "ngo" | "admin";
};

export type UserProfile = {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  city?: string;
  state?: string;
  rescuePoints?: number;
};

export type RescueSummary = {
  reportsSubmitted: number;
  casesInProgress: number;
  casesResolved: number;
  rewardPointsEarned: number;
};

export const authApi = {
  register: (payload: RegisterPayload) => api.post("/auth/register", payload),
  login: (payload: AuthPayload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
  updateMe: (payload: Partial<UserProfile>) => api.put("/auth/me", payload),
};

export const rescueApi = {
  summary: () => api.get("/rescue/user/summary"),
  history: () => api.get("/rescue/user/history"),
  report: (payload: FormData) =>
    api.post("/rescue/report", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const rewardsApi = {
  list: () => api.get("/rewards"),
};
