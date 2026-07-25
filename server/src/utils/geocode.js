// Free geocoding via OpenStreetMap Nominatim (no API key required).
// Falls back to a static table of major European city coordinates if the
// live lookup fails (offline environment, rate limiting, etc.) so hotel
// creation never breaks just because a map pin couldn't be resolved.

const FALLBACK_CITY_COORDS = {
  paris: { lat: 48.8566, lng: 2.3522 },
  rome: { lat: 41.9028, lng: 12.4964 },
  barcelona: { lat: 41.3874, lng: 2.1686 },
  prague: { lat: 50.0755, lng: 14.4378 },
  vienna: { lat: 48.2082, lng: 16.3738 },
  amsterdam: { lat: 52.3676, lng: 4.9041 },
  berlin: { lat: 52.52, lng: 13.405 },
  lisbon: { lat: 38.7223, lng: -9.1393 },
  budapest: { lat: 47.4979, lng: 19.0402 },
  athens: { lat: 37.9838, lng: 23.7275 },
  madrid: { lat: 40.4168, lng: -3.7038 },
  london: { lat: 51.5072, lng: -0.1276 },
  dublin: { lat: 53.3498, lng: -6.2603 },
  copenhagen: { lat: 55.6761, lng: 12.5683 },
  stockholm: { lat: 59.3293, lng: 18.0686 },
  venice: { lat: 45.4408, lng: 12.3155 },
  florence: { lat: 43.7696, lng: 11.2558 },
  krakow: { lat: 50.0647, lng: 19.945 },
  brussels: { lat: 50.8503, lng: 4.3517 },
  zagreb: { lat: 45.815, lng: 15.9819 },
  reykjavik: { lat: 64.1466, lng: -21.9426 },
};

export async function geocode({ city, country }) {
  const query = `${city}, ${country}`;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      query
    )}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "hotelcamp-europe-demo/1.0" },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const results = await res.json();
      if (results && results[0]) {
        return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
      }
    }
  } catch (err) {
    // network unavailable / rate limited — fall through to fallback table
  }

  const key = city?.trim().toLowerCase();
  if (key && FALLBACK_CITY_COORDS[key]) {
    return FALLBACK_CITY_COORDS[key];
  }

  // Last resort: center of Europe, so the app still functions.
  return { lat: 50.1109, lng: 8.6821 };
}
