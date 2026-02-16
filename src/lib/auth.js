const API_ROOT = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/$/, "");
const TOKEN_KEY = "davedeals_auth_token";
const USER_KEY = "davedeals_auth_user";

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function register(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function setSession(token, user) {
  if (!token || !user) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent("auth:changed"));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new CustomEvent("auth:changed"));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getSessionUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isSignedIn() {
  return Boolean(getToken() && getSessionUser());
}

export function getApiRoot() {
  return API_ROOT;
}
