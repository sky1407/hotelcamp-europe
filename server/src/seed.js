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
];

const SAMPLE_REVIEWS = [
  { rating: 5, body: "Absolutely loved the location and the staff were incredibly helpful." },
  { rating: 4, body: "Great value for money, breakfast could be better though." },
  { rating: 5, body: "Beautiful rooms, would definitely stay again." },
  { rating: 3, body: "Decent stay but a bit noisy at night." },
];

async function seed() {
  console.log("Clearing existing data...");
  db.exec("DELETE FROM reviews; DELETE FROM hotels; DELETE FROM users;");

  console.log("Creating demo user...");
  const demoUser = User.create({
    username: "demo",
    email: "demo@hotelcamp.eu",
    password: "password123",
  });

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

    const reviewCount = 1 + Math.floor(Math.random() * SAMPLE_REVIEWS.length);
    for (let i = 0; i < reviewCount; i++) {
      const r = SAMPLE_REVIEWS[i % SAMPLE_REVIEWS.length];
      Review.create({
        hotel_id: hotel.id,
        author_id: demoUser.id,
        rating: r.rating,
        body: r.body,
      });
    }
    console.log(`  + ${h.title} (${h.city}, ${h.country})`);
  }

  console.log("\nDone. Log in with username 'demo' / password 'password123'.");
}

seed().then(() => process.exit(0));
