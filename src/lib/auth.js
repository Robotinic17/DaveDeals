const API_ROOT = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/$/, "");
const TOKEN_KEY = "davedeals_auth_token";
const USER_KEY = "davedeals_auth_user";

export async function apiRequest(path, options = {}) {
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
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitSellerApplication(payload) {
  return apiRequest("/seller-applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchMySellerApplication() {
  return apiRequest("/seller-applications/me");
}

export function fetchSellerApplications() {
  return apiRequest("/admin/seller-applications");
}

export function approveSellerApplication(id) {
  return apiRequest(`/admin/seller-applications/${id}/approve`, {
    method: "POST",
  });
}

export function rejectSellerApplication(id, reason) {
  return apiRequest(`/admin/seller-applications/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function fetchAdminOverview() {
  return apiRequest("/admin/overview");
}

export function fetchAdminSellers() {
  return apiRequest("/admin/sellers");
}

export function fetchAdminProducts() {
  return apiRequest("/admin/products");
}

export function updateAdminProductStatus(id, status, reason) {
  return apiRequest(`/admin/products/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, reason }),
  });
}

export function fetchSellerProfile() {
  return apiRequest("/seller/me");
}

export function updateSellerProfile(payload) {
  return apiRequest("/seller/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function fetchSellerProducts() {
  return apiRequest("/seller/products");
}

export function createSellerProduct(payload) {
  return apiRequest("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateSellerProduct(id, payload) {
  return apiRequest(`/products/${id}`, {
    method: "PATCH",
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

export function hasRole(...roles) {
  const user = getSessionUser();
  if (!user?.role) return false;
  return roles.includes(user.role);
}

export function getApiRoot() {
  return API_ROOT;
}
