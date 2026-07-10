const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("r4m_token");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data;
}

// ---------- Auth ----------
export const registerUser = (payload) =>
  request("/auth/register", { method: "POST", body: payload, auth: false });
export const loginUser = (payload) =>
  request("/auth/login", { method: "POST", body: payload, auth: false });

// ---------- Dashboard ----------
export const getDashboardData = () => request("/dashboard");

// ---------- Recharge Link ----------
export const getMyLink = () => request("/recharge/me");
export const updateLinkSettings = (payload) =>
  request("/recharge/settings", { method: "PATCH", body: payload });
export const getPublicLink = (username) =>
  request(`/recharge/public/${username}`, { auth: false });
export const submitRecharge = (username, payload) =>
  request(`/recharge/public/${username}/submit`, {
    method: "POST",
    body: payload,
    auth: false,
  });

// ---------- Transactions ----------
export const getTransactions = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/transactions${query ? `?${query}` : ""}`);
};
export const getTransactionStats = () => request("/transactions/stats");

// ---------- Settings ----------
export const getProfile = () => request("/settings/profile");
export const updateProfile = (payload) =>
  request("/settings/profile", { method: "PATCH", body: payload });
export const updateNotificationPrefs = (payload) =>
  request("/settings/notifications", { method: "PATCH", body: payload });
