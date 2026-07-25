import db from "../db.js";

export const Hotel = {
  create(data) {
    const stmt = db.prepare(`
      INSERT INTO hotels (title, description, price, country, city, address, image_filename, image_url, lat, lng, author_id)
      VALUES (@title, @description, @price, @country, @city, @address, @image_filename, @image_url, @lat, @lng, @author_id)
    `);
    const info = stmt.run(data);
    return Hotel.findById(info.lastInsertRowid);
  },

  findAll({ country, search } = {}) {
    let query = `
      SELECT h.*, u.username AS author_username,
        (SELECT AVG(rating) FROM reviews WHERE hotel_id = h.id) AS avg_rating,
        (SELECT COUNT(*) FROM reviews WHERE hotel_id = h.id) AS review_count
      FROM hotels h
      JOIN users u ON u.id = h.author_id
      WHERE 1=1
    `;
    const params = {};
    if (country) {
      query += " AND h.country = @country";
      params.country = country;
    }
    if (search) {
      query += " AND (h.title LIKE @search OR h.city LIKE @search OR h.country LIKE @search)";
      params.search = `%${search}%`;
    }
    query += " ORDER BY h.created_at DESC";
    return db.prepare(query).all(params);
  },

  findById(id) {
    return db
      .prepare(
        `SELECT h.*, u.username AS author_username
         FROM hotels h JOIN users u ON u.id = h.author_id
         WHERE h.id = ?`
      )
      .get(id);
  },

  update(id, data) {
    const stmt = db.prepare(`
      UPDATE hotels SET
        title = @title,
        description = @description,
        price = @price,
        country = @country,
        city = @city,
        address = @address,
        image_filename = COALESCE(@image_filename, image_filename),
        image_url = COALESCE(@image_url, image_url),
        lat = @lat,
        lng = @lng
      WHERE id = @id
    `);
    stmt.run({ ...data, id });
    return Hotel.findById(id);
  },

  delete(id) {
    return db.prepare("DELETE FROM hotels WHERE id = ?").run(id);
  },

  listCountries() {
    return db
      .prepare("SELECT DISTINCT country FROM hotels ORDER BY country")
      .all()
      .map((r) => r.country);
  },
};
