async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers:
      options.body instanceof FormData
        ? undefined
        : { "Content-Type": "application/json" },
    ...options,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(data?.error || "Something went wrong");
  }
  return data;
}

export const api = {
  register: (payload) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),

  getHotels: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request(`/hotels${qs ? `?${qs}` : ""}`);
  },
  getHotel: (id) => request(`/hotels/${id}`),
  createHotel: (formData) =>
    request("/hotels", { method: "POST", body: formData }),
  updateHotel: (id, formData) =>
    request(`/hotels/${id}`, { method: "PUT", body: formData }),
  deleteHotel: (id) => request(`/hotels/${id}`, { method: "DELETE" }),

  addReview: (hotelId, payload) =>
    request(`/hotels/${hotelId}/reviews`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deleteReview: (hotelId, reviewId) =>
    request(`/hotels/${hotelId}/reviews/${reviewId}`, { method: "DELETE" }),
};
