const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("mindcraft_token");

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
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

export function logout() {
  return request("/auth/logout", { method: "POST" });
}

export function forgotPassword(payload) {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser(token) {
  return request("/auth/me", {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : getAuthHeaders(),
  });
}
