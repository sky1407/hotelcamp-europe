import db from "./db.js";
import { User } from "./models/User.js";
import { Hotel } from "./models/Hotel.js";
import { Review } from "./models/Review.js";
import { geocode } from "./utils/geocode.js";

const HOTELS = [
  {
    title: "Le Marais Boutique Hotel",
    description: "Charming boutique hotel tucked in the historic Marais district, minutes from the Louvre.",
    price: 189,
    country: "France",
    city: "Paris",
    address: "12 Rue des Rosiers",
    image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  },
  {
    title: "Trastevere Garden Inn",
    description: "A quiet garden courtyard hotel in Rome's most romantic neighborhood, Trastevere.",
    price: 145,
    country: "Italy",
    city: "Rome",
    address: "Via della Scala 21",
    image_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
  },
  {
    title: "Gothic Quarter Suites",
    description: "Modern suites inside a restored medieval building in Barcelona's Gothic Quarter.",
    price: 160,
    country: "Spain",
    city: "Barcelona",
    address: "Carrer del Bisbe 5",
    image_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
  },
  {
    title: "Old Town Prague Residence",
    description: "Cozy rooms with views of Prague Castle, steps from Charles Bridge.",
    price: 98,
    country: "Czech Republic",
    city: "Prague",
    address: "Karlova 8",
    image_url: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800",
  },
  {
    title: "Ringstrasse Grand Hotel",
    description: "Classic Viennese elegance along the iconic Ringstrasse boulevard.",
    price: 175,
    country: "Austria",
    city: "Vienna",
    address: "Ringstrasse 14",
    image_url: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
  },
  {
    title: "Canal House Amsterdam",
    description: "A 17th-century canal house converted into a cozy boutique hotel on the Prinsengracht.",
    price: 210,
    country: "Netherlands",
    city: "Amsterdam",
    address: "Prinsengracht 263",
    image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  },
  {
    title: "Mitte Design Hotel",
    description: "Industrial-chic hotel in Berlin-Mitte, close to Museum Island and nightlife.",
    price: 120,
    country: "Germany",
    city: "Berlin",
    address: "Torstrasse 100",
    image_url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
  },
  {
    title: "Alfama Hillside Hotel",
    description: "Tiled facade hotel with panoramic views over the Tagus river and Alfama rooftops.",
    price: 110,
    country: "Portugal",
    city: "Lisbon",
    address: "Rua de Sao Tome 15",
    image_url: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800",
  },
  {
    title: "Danube Promenade Hotel",
    description: "Riverside hotel with views of Budapest's Parliament building lit up at night.",
    price: 105,
    country: "Hungary",
    city: "Budapest",
    address: "Jane Haining Rakpart 7",
    image_url: "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=800",
  },
  {
    title: "Plaka Rooftop Hotel",
    description: "Small rooftop hotel with unbeatable sunset views of the Acropolis.",
    price: 135,
    country: "Greece",
    city: "Athens",
    address: "Adrianou 45",
    image_url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800",
  },
  {
    title: "Sol Rooftop Hotel",
    description: "Sun-drenched rooftop pool and terrace bar overlooking Madrid's Puerta del Sol.",
    price: 155,
    country: "Spain",
    city: "Madrid",
    address: "Calle del Carmen 9",
    image_url: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=800",
  },
  {
    title: "Nyhavn Harbor Hotel",
    description: "Colourful harbourside hotel steps from Copenhagen's iconic Nyhavn canal.",
    price: 195,
    country: "Denmark",
    city: "Copenhagen",
    address: "Nyhavn 21",
    image_url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
  },
  {
    title: "Temple Bar Townhouse Hotel",
    description: "Georgian townhouse hotel in the heart of Dublin's lively Temple Bar district.",
    price: 130,
    country: "Ireland",
    city: "Dublin",
    address: "Fleet Street 6",
    image_url: "https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=800",
  },
  {
    title: "Old Town Krakow Hotel",
    description: "Restored townhouse hotel on Krakow's medieval market square, near St. Mary's Basilica.",
    price: 89,
    country: "Poland",
    city: "Krakow",
    address: "Rynek Glowny 12",
    image_url: "https://images.unsplash.com/photo-1649731000184-7ced04998f44?w=800",
  },
  {
    title: "Gamla Stan Waterfront Hotel",
    description: "Waterfront hotel with views over Stockholm's old town and archipelago ferries.",
    price: 180,
    country: "Sweden",
    city: "Stockholm",
    address: "Skeppsbron 30",
    image_url: "https://images.unsplash.com/photo-1656533391146-dad89b5a8b40?w=800",
  },
  {
    title: "Grand Place Boutique Hotel",
    description: "Elegant boutique hotel a short walk from Brussels' Grand Place and its chocolate shops.",
    price: 140,
    country: "Belgium",
    city: "Brussels",
    address: "Rue du Marche aux Herbes 15",
    image_url: "https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=800",
  },
];

const SAMPLE_REVIEWS = [
  { rating: 5, body: "Absolutely loved the location and the staff were incredibly helpful." },
  { rating: 4, body: "Great value for money, breakfast could be better though." },
  { rating: 5, body: "Beautiful rooms, would definitely stay again." },
  { rating: 3, body: "Decent stay but a bit noisy at night." },
  { rating: 5, body: "Stunning views and the bed was so comfortable, best sleep I've had in ages." },
  { rating: 4, body: "Really friendly front desk staff, checked us in early with no fuss." },
  { rating: 4, body: "Perfect base for exploring the old town, everything was walkable." },
  { rating: 5, body: "The rooftop terrace alone is worth the price of the room." },
];

const REVIEWERS = [
  { username: "jasmine_c", email: "jasmine.carter@example.com" },
  { username: "linda_n", email: "linda.nguyen@example.com" },
  { username: "joseph_b", email: "joseph.bennett@example.com" },
  { username: "george_m", email: "george.miller@example.com" },
  { username: "emma_c", email: "emma.clarke@example.com" },
  { username: "michael_r", email: "michael.ross@example.com" },
  { username: "sophia_w", email: "sophia.walker@example.com" },
  { username: "daniel_h", email: "daniel.harris@example.com" },
];

function shuffled(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function seed() {
  console.log("Clearing existing data...");
  db.exec("DELETE FROM reviews; DELETE FROM hotels; DELETE FROM users;");

  console.log("Creating demo user...");
  const demoUser = User.create({
    username: "demo",
    email: "demo@hotelcamp.eu",
    password: "password123",
  });

  console.log("Creating reviewers...");
  const reviewers = REVIEWERS.map((r) =>
    User.create({ username: r.username, email: r.email, password: "password123" })
  );

  console.log("Creating hotels across Europe...");
  for (const h of HOTELS) {
    const { lat, lng } = await geocode({ city: h.city, country: h.country });
    const hotel = Hotel.create({
      title: h.title,
      description: h.description,
      price: h.price,
      country: h.country,
      city: h.city,
      address: h.address,
      image_filename: null,
      image_url: h.image_url,
      lat,
      lng,
      author_id: demoUser.id,
    });

    const reviewCount = 2 + Math.floor(Math.random() * 3);
    const chosenReviewers = shuffled(reviewers).slice(0, reviewCount);
    chosenReviewers.forEach((reviewer, i) => {
      const r = SAMPLE_REVIEWS[Math.floor(Math.random() * SAMPLE_REVIEWS.length)];
      Review.create({
        hotel_id: hotel.id,
        author_id: reviewer.id,
        rating: r.rating,
        body: r.body,
      });
    });
    console.log(`  + ${h.title} (${h.city}, ${h.country})`);
  }

  console.log("\nDone. Log in with username 'demo' / password 'password123'.");
}

seed().then(() => process.exit(0));
