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

export function getCart() {
  return request("/cart");
}

export function addToCart(courseId) {
  return request("/cart/items", {
    method: "POST",
    body: JSON.stringify({ courseId }),
  });
}

export function removeFromCart(courseId) {
  return request(`/cart/items/${courseId}`, {
    method: "DELETE",
  });
}

export function applyPromoCode(code) {
  return request("/cart/promo", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export function clearPromoCode() {
  return request("/cart/promo", {
    method: "DELETE",
  });
}

export function checkout(payload) {
  return request("/orders/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getOrderHistory() {
  return request("/orders");
}

export function getLatestOrder() {
  return request("/orders/latest");
}
