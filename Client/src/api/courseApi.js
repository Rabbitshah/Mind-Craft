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

export function getCourses({ search = "", category = "", sort = "popular", featured = false } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category && category !== "All Courses") params.set("category", category);
  if (sort) params.set("sort", sort);
  if (featured) params.set("featured", "true");

  return request(`/courses?${params.toString()}`);
}

export function getCourseById(courseId) {
  return request(`/courses/${courseId}`);
}

export function updateCourseProgress(courseId, lessonTitle) {
  return request(`/courses/${courseId}/progress`, {
    method: "POST",
    body: JSON.stringify({ lessonTitle }),
  });
}
