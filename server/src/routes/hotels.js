import { Router } from "express";
import { Hotel } from "../models/Hotel.js";
import { Review } from "../models/Review.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ExpressError } from "../utils/ExpressError.js";
import { isLoggedIn, isHotelAuthor } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { geocode } from "../utils/geocode.js";

const router = Router();

router.get(
  "/",
  catchAsync(async (req, res) => {
    const { country, search } = req.query;
    const hotels = Hotel.findAll({ country, search });
    res.json({ hotels, countries: Hotel.listCountries() });
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const hotel = Hotel.findById(req.params.id);
    if (!hotel) throw new ExpressError("Hotel not found", 404);
    const reviews = Review.findByHotel(hotel.id);
    res.json({ hotel, reviews });
  })
);

router.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  catchAsync(async (req, res) => {
    const { title, description, price, country, city, address } = req.body;
    if (!title || !description || !price || !country || !city) {
      throw new ExpressError("Title, description, price, country and city are required", 400);
    }
    const { lat, lng } = await geocode({ city, country });
    const hotel = Hotel.create({
      title,
      description,
      price: parseFloat(price),
      country,
      city,
      address: address || null,
      image_filename: req.file ? req.file.filename : null,
      image_url: req.file ? `/uploads/${req.file.filename}` : null,
      lat,
      lng,
      author_id: req.session.userId,
    });
    res.status(201).json({ hotel });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isHotelAuthor,
  upload.single("image"),
  catchAsync(async (req, res) => {
    const { title, description, price, country, city, address } = req.body;
    let lat = req.hotel.lat;
    let lng = req.hotel.lng;
    if (city !== req.hotel.city || country !== req.hotel.country) {
      const coords = await geocode({ city, country });
      lat = coords.lat;
      lng = coords.lng;
    }
    const hotel = Hotel.update(req.params.id, {
      title,
      description,
      price: parseFloat(price),
      country,
      city,
      address: address || null,
      image_filename: req.file ? req.file.filename : null,
      image_url: req.file ? `/uploads/${req.file.filename}` : null,
      lat,
      lng,
    });
    res.json({ hotel });
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isHotelAuthor,
  catchAsync(async (req, res) => {
    Hotel.delete(req.params.id);
    res.json({ ok: true });
  })
);

export default router;
