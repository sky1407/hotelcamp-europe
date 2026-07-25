import { Link } from "react-router-dom";
import StarRating from "./StarRating.jsx";

export default function HotelCard({ hotel }) {
  return (
    <Link to={`/hotels/${hotel.id}`} className="hotel-card">
      <div
        className="hotel-card-img"
        style={{
          backgroundImage: `url(${hotel.image_url || "https://via.placeholder.com/400x250?text=No+Image"})`,
        }}
      />
      <div className="hotel-card-body">
        <h3>{hotel.title}</h3>
        <p className="muted">
          {hotel.city}, {hotel.country}
        </p>
        <div className="hotel-card-meta">
          <StarRating rating={hotel.avg_rating || 0} />
          <span className="muted small">
            {hotel.review_count || 0} review{hotel.review_count === 1 ? "" : "s"}
          </span>
        </div>
        <p className="price">€{hotel.price} / night</p>
      </div>
    </Link>
  );
}
