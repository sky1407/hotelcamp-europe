import db from "../db.js";

export const Review = {
  create({ hotel_id, author_id, rating, body }) {
    const stmt = db.prepare(
      "INSERT INTO reviews (hotel_id, author_id, rating, body) VALUES (?, ?, ?, ?)"
    );
    const info = stmt.run(hotel_id, author_id, rating, body);
    return Review.findById(info.lastInsertRowid);
  },

  findById(id) {
    return db
      .prepare(
        `SELECT r.*, u.username AS author_username
         FROM reviews r JOIN users u ON u.id = r.author_id
         WHERE r.id = ?`
      )
      .get(id);
  },

  findByHotel(hotel_id) {
    return db
      .prepare(
        `SELECT r.*, u.username AS author_username
         FROM reviews r JOIN users u ON u.id = r.author_id
         WHERE r.hotel_id = ?
         ORDER BY r.created_at DESC`
      )
      .all(hotel_id);
  },

  delete(id) {
    return db.prepare("DELETE FROM reviews WHERE id = ?").run(id);
  },
};
