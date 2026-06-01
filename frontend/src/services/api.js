const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    throw new Error(body.message || "Request failed");
  }
  return body.data;
}

export const api = {
  dashboard: () => request("/dashboard/summary"),
  products: {
    list: (search = "") => request(`/products${search ? `?search=${encodeURIComponent(search)}` : ""}`),
    create: (payload) => request("/products", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    delete: (id) => request(`/products/${id}`, { method: "DELETE" })
  },
  customers: {
    list: (search = "") => request(`/customers${search ? `?search=${encodeURIComponent(search)}` : ""}`),
    create: (payload) => request("/customers", { method: "POST", body: JSON.stringify(payload) }),
    delete: (id) => request(`/customers/${id}`, { method: "DELETE" })
  },
  orders: {
    list: () => request("/orders"),
    create: (payload) => request("/orders", { method: "POST", body: JSON.stringify(payload) }),
    delete: (id) => request(`/orders/${id}`, { method: "DELETE" })
  }
};
