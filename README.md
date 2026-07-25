# HotelCamp Europe

A YelpCamp-style full-stack app, but for hotels across Europe: browse, add, edit and delete hotel listings, leave star-rated reviews, and see each hotel on a map.

Inspired by the YelpCamp project from *The Web Developer Bootcamp* (Udemy), rebuilt with a modern stack instead of the course's Express/EJS/MongoDB combo:

- **Backend:** Node.js + Express REST API, SQLite (via `better-sqlite3`) instead of MongoDB — zero-config, no external database service or account needed. Sessions + bcrypt for auth, multer for local image uploads.
- **Frontend:** React + Vite (instead of EJS server-rendered views), React Router, and **Leaflet + OpenStreetMap** for the map (instead of Mapbox) so no paid API key is required at all.
- **Geocoding:** free OpenStreetMap Nominatim lookup (with an offline fallback table of major European cities) to place each hotel on the map.

Everything runs locally out of the box — no MongoDB Atlas, Cloudinary, or Mapbox account needed. Swap those in later if you want (see "Going further" below).

## Project structure

```
hotelcamp-europe/
  server/     Express API + SQLite database + image uploads
  client/     React + Vite frontend
```

## Setup

Requires Node.js 18+.

### 1. Backend

```bash
cd server
npm install
cp .env.example .env      # defaults are fine for local dev
npm run seed               # creates demo user + 10 sample hotels across Europe
npm run dev                 # starts API on http://localhost:5000
```

Demo login after seeding: **username** `demo`, **password** `password123`.

### 2. Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev                 # starts React on http://localhost:5173
```

Open http://localhost:5173 — the Vite dev server proxies `/api` and `/uploads` to the backend, so there's no CORS setup needed.

## Features

- Browse hotels, filter by country, search by name/city/country
- Register / log in / log out (sessions + bcrypt password hashing)
- Add a hotel with title, description, price, country, city, address and a photo (only when logged in)
- Edit/delete your own hotels only (author-only authorization, like YelpCamp's campground ownership checks)
- Leave a star rating + written review on any hotel; delete your own reviews
- Each hotel automatically gets a map pin (geocoded from city/country) shown with Leaflet/OpenStreetMap — no API key required

## Production build

```bash
cd client && npm run build
cd ../server && npm start
```

The Express server serves the built React app from `client/dist` and the API from the same origin/port, so a single `npm start` in `server/` is enough to run the whole app in production.

## Going further

- Swap SQLite for MongoDB/Postgres by rewriting `server/src/models/*.js` — the routes call a small, consistent model interface (`create`, `findAll`, `findById`, `update`, `delete`), so the rest of the app doesn't need to change.
- Swap local disk image storage for Cloudinary: replace `server/src/middleware/upload.js` with Cloudinary's multer storage engine and add your credentials to `.env`.
- Swap OpenStreetMap tiles for Mapbox: replace the `TileLayer` URL in `client/src/components/MapView.jsx` with a Mapbox tile URL + token.

## Note on this build

This project was scaffolded in a sandboxed environment without access to the npm registry, so dependencies could not be installed or the app run end-to-end here. All backend JavaScript passed `node --check` for syntax validity, and the code was hand-reviewed, but you should run through register → add hotel → review → edit → delete once locally to confirm everything behaves as expected, and report back anything that needs fixing.
