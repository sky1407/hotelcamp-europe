import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import HotelCard from "../components/HotelCard.jsx";

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .getHotels({ country, search })
      .then((data) => {
        setHotels(data.hotels);
        setCountries(data.countries);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [country, search]);

  return (
    <div className="page">
      <div className="hero">
        <h1>Find your next stay in Europe</h1>
        <p className="muted">Hand-picked hotels from Paris to Athens, added and reviewed by travelers.</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by hotel, city or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading hotels...</p>
      ) : hotels.length === 0 ? (
        <p className="muted">No hotels found. Try a different search, or add the first one!</p>
      ) : (
        <div className="hotel-grid">
          {hotels.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>
      )}
    </div>
  );
}
