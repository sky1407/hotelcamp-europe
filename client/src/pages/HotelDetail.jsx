import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import StarRating from "../components/StarRating.jsx";
import MapView from "../components/MapView.jsx";
import ReviewList from "../components/ReviewList.jsx";
import ReviewForm from "../components/ReviewForm.jsx";

export default function HotelDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .getHotel(id)
      .then((data) => {
        setHotel(data.hotel);
        setReviews(data.reviews);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [id]);

  async function handleDeleteHotel() {
    if (!confirm("Delete this hotel? This cannot be undone.")) return;
    await api.deleteHotel(id);
    navigate("/");
  }

  async function handleAddReview(payload) {
    await api.addReview(id, payload);
    load();
  }

  async function handleDeleteReview(reviewId) {
    if (!confirm("Delete this review?")) return;
    await api.deleteReview(id, reviewId);
    load();
  }

  if (loading) return <p className="page muted">Loading...</p>;
  if (error) return <p className="page error">{error}</p>;
  if (!hotel) return null;

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  const isOwner = user && user.id === hotel.author_id;

  return (
    <div className="page hotel-detail">
      <Link to="/" className="back-link">
        ← Back to all hotels
      </Link>

      <div className="hotel-detail-grid">
        <div>
          <img
            className="hotel-detail-img"
            src={hotel.image_url || "https://via.placeholder.com/700x400?text=No+Image"}
            alt={hotel.title}
          />

          <h1>{hotel.title}</h1>
          <p className="muted">
            {hotel.address ? `${hotel.address}, ` : ""}
            {hotel.city}, {hotel.country}
          </p>
          <div className="hotel-card-meta">
            <StarRating rating={avg} />
            <span className="muted small">
              {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </span>
          </div>
          <p className="price">€{hotel.price} / night</p>
          <p>{hotel.description}</p>
          <p className="muted small">Listed by {hotel.author_username}</p>

          {isOwner && (
            <div className="owner-actions">
              <Link to={`/hotels/${hotel.id}/edit`} className="btn-secondary">
                Edit
              </Link>
              <button className="btn-danger" onClick={handleDeleteHotel}>
                Delete
              </button>
            </div>
          )}
        </div>

        <div>
          <MapView lat={hotel.lat} lng={hotel.lng} title={hotel.title} />
        </div>
      </div>

      <hr />

      <div className="reviews-section">
        <h2>Reviews</h2>
        {user ? (
          <ReviewForm onSubmit={handleAddReview} />
        ) : (
          <p className="muted">
            <Link to="/login">Log in</Link> to leave a review.
          </p>
        )}
        <ReviewList reviews={reviews} onDelete={handleDeleteReview} />
      </div>
    </div>
  );
}
