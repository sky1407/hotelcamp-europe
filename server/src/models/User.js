import bcrypt from "bcryptjs";
import db from "../db.js";

export const User = {
  create({ username, email, password }) {
    const hash = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)"
    );
    const info = stmt.run(username, email, hash);
    return User.findById(info.lastInsertRowid);
  },

  findById(id) {
    return db
      .prepare("SELECT id, username, email, created_at FROM users WHERE id = ?")
      .get(id);
  },

  findByUsername(username) {
    return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  },

  findByEmail(email) {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  },

  verifyPassword(user, password) {
    return bcrypt.compareSync(password, user.password_hash);
  },

  toPublic(user) {
    if (!user) return null;
    const { password_hash, ...pub } = user;
    return pub;
  },
};
