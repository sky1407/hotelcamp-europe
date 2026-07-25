import StarRating from "./StarRating.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ReviewList({ reviews, onDelete }) {
  const { user } = useAuth();

  if (!reviews.length) {
    return <p className="muted">No reviews yet. Be the first to leave one!</p>;
  }

  return (
    <ul className="review-list">
      {reviews.map((r) => (
        <li key={r.id} className="review-item">
          <div className="review-header">
            <strong>{r.author_username}</strong>
            <StarRating rating={r.rating} size={14} />
          </div>
          <p>{r.body}</p>
          <div className="review-footer">
            <span className="muted small">
              {new Date(r.created_at).toLocaleDateString()}
            </span>
            {user && user.id === r.author_id && (
              <button className="link-btn danger" onClick={() => onDelete(r.id)}>
                Delete
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
