import demoHotels from "../demoData.json";

let hotels = demoHotels.map((h) => ({ ...h, reviews: [...h.reviews] }));
let nextHotelId = Math.max(...hotels.map((h) => h.id)) + 1;
let nextReviewId =
  Math.max(0, ...hotels.flatMap((h) => h.reviews.map((r) => r.id))) + 1;
let nextUserId = 9000;

const users = new Map([
  ["demo", { id: hotels[0]?.author_id ?? 1, username: "demo", email: "demo@hotelcamp.eu", password: "password123" }],
]);

let currentUser = null;

function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function publicUser(u) {
  if (!u) return null;
  const { password, ...pub } = u;
  return pub;
}

function withComputed(hotel) {
  const { reviews, ...rest } = hotel;
  const review_count = reviews.length;
  const avg_rating = review_count
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / review_count
    : null;
  return { ...rest, review_count, avg_rating };
}

function requireLogin() {
  if (!currentUser) throw new Error("You must be logged in");
  return currentUser;
}

export const mockApi = {
  async register({ username, email, password }) {
    await delay();
    if (users.has(username)) throw new Error("Username already taken");
    const user = { id: nextUserId++, username, email, password };
    users.set(username, user);
    currentUser = user;
    return { user: publicUser(user) };
  },

  async login({ username, password }) {
    await delay();
    const user = users.get(username);
    if (!user || user.password !== password) {
      throw new Error("Invalid username or password");
    }
    currentUser = user;
    return { user: publicUser(user) };
  },

  async logout() {
    await delay(50);
    currentUser = null;
    return { ok: true };
  },

  async me() {
    await delay(50);
    if (!currentUser) throw new Error("Not logged in");
    return { user: publicUser(currentUser) };
  },

  async getHotels({ country, search } = {}) {
    await delay();
    let list = hotels;
    if (country) list = list.filter((h) => h.country === country);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.country.toLowerCase().includes(q)
      );
    }
    const countries = [...new Set(hotels.map((h) => h.country))].sort();
    return { hotels: list.map(withComputed), countries };
  },

  async getHotel(id) {
    await delay();
    const hotel = hotels.find((h) => String(h.id) === String(id));
    if (!hotel) throw new Error("Hotel not found");
    return { hotel: withComputed(hotel), reviews: hotel.reviews };
  },

  async createHotel(formData) {
    await delay();
    const user = requireLogin();
    const get = (k) => formData.get(k);
    const file = formData.get("image");
    const hotel = {
      id: nextHotelId++,
      title: get("title"),
      description: get("description"),
      price: parseFloat(get("price")),
      country: get("country"),
      city: get("city"),
      address: get("address") || null,
      image_url: file && file.size > 0 ? URL.createObjectURL(file) : null,
      lat: 50.1109,
      lng: 8.6821,
      author_id: user.id,
      author_username: user.username,
      created_at: new Date().toISOString(),
      reviews: [],
    };
    hotels = [hotel, ...hotels];
    return { hotel: withComputed(hotel) };
  },

  async updateHotel(id, formData) {
    await delay();
    const user = requireLogin();
    const hotel = hotels.find((h) => String(h.id) === String(id));
    if (!hotel) throw new Error("Hotel not found");
    if (hotel.author_id !== user.id) throw new Error("Not authorized");
    const get = (k) => formData.get(k);
    const file = formData.get("image");
    hotel.title = get("title");
    hotel.description = get("description");
    hotel.price = parseFloat(get("price"));
    hotel.country = get("country");
    hotel.city = get("city");
    hotel.address = get("address") || null;
    if (file && file.size > 0) hotel.image_url = URL.createObjectURL(file);
    return { hotel: withComputed(hotel) };
  },

  async deleteHotel(id) {
    await delay();
    const user = requireLogin();
    const hotel = hotels.find((h) => String(h.id) === String(id));
    if (!hotel) throw new Error("Hotel not found");
    if (hotel.author_id !== user.id) throw new Error("Not authorized");
    hotels = hotels.filter((h) => h.id !== hotel.id);
    return { ok: true };
  },

  async addReview(hotelId, { rating, body }) {
    await delay();
    const user = requireLogin();
    const hotel = hotels.find((h) => String(h.id) === String(hotelId));
    if (!hotel) throw new Error("Hotel not found");
    const review = {
      id: nextReviewId++,
      hotel_id: hotel.id,
      author_id: user.id,
      author_username: user.username,
      rating,
      body,
      created_at: new Date().toISOString(),
    };
    hotel.reviews = [review, ...hotel.reviews];
    return { review };
  },

  async deleteReview(hotelId, reviewId) {
    await delay();
    const user = requireLogin();
    const hotel = hotels.find((h) => String(h.id) === String(hotelId));
    if (!hotel) throw new Error("Hotel not found");
    const review = hotel.reviews.find((r) => String(r.id) === String(reviewId));
    if (!review) throw new Error("Review not found");
    if (review.author_id !== user.id) throw new Error("Not authorized");
    hotel.reviews = hotel.reviews.filter((r) => r.id !== review.id);
    return { ok: true };
  },
};
