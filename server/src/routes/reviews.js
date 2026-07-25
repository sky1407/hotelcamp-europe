import { Router } from "express";
import { Review } from "../models/Review.js";
import { Hotel } from "../models/Hotel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ExpressError } from "../utils/ExpressError.js";
import { isLoggedIn, isReviewAuthor } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const hotel = Hotel.findById(req.params.id);
    if (!hotel) throw new ExpressError("Hotel not found", 404);
    const { rating, body } = req.body;
    const ratingNum = parseInt(rating, 10);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      throw new ExpressError("Rating must be between 1 and 5", 400);
    }
    if (!body || !body.trim()) {
      throw new ExpressError("Review text is required", 400);
    }
    const review = Review.create({
      hotel_id: hotel.id,
      author_id: req.session.userId,
      rating: ratingNum,
      body,
    });
    res.status(201).json({ review });
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    Review.delete(req.params.reviewId);
    res.json({ ok: true });
  })
);

export default router;
