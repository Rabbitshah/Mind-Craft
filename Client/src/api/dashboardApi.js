const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("mindcraft_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: getAuthHeaders(),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export function getLearnerDashboard() {
  return request("/dashboard/learner");
}

export function getInstructorDashboard() {
  return request("/dashboard/instructor");
}
