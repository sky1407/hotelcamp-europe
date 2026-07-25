import { useState } from "react";

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ rating, body });
      setBody("");
      setRating(5);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h4>Leave a review</h4>
      {error && <p className="error">{error}</p>}
      <label>
        Rating
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n === 1 ? "" : "s"}
            </option>
          ))}
        </select>
      </label>
      <label>
        Review
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="How was your stay?"
          required
          rows={3}
        />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? "Posting..." : "Post review"}
      </button>
    </form>
  );
}
