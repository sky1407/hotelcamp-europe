export default function StarRating({ rating = 0, size = 16 }) {
  const rounded = Math.round(rating);
  return (
    <span className="stars" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rounded ? "star filled" : "star"}>
          ★
        </span>
      ))}
    </span>
  );
}
