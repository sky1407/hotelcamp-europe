import { ExpressError } from "../utils/ExpressError.js";
import { Hotel } from "../models/Hotel.js";
import { Review } from "../models/Review.js";

export function isLoggedIn(req, res, next) {
  if (!req.session.userId) {
    return next(new ExpressError("You must be logged in", 401));
  }
  next();
}

export function isHotelAuthor(req, res, next) {
  const hotel = Hotel.findById(req.params.id);
  if (!hotel) return next(new ExpressError("Hotel not found", 404));
  if (hotel.author_id !== req.session.userId) {
    return next(new ExpressError("You do not have permission to do that", 403));
  }
  req.hotel = hotel;
  next();
}

export function isReviewAuthor(req, res, next) {
  const review = Review.findById(req.params.reviewId);
  if (!review) return next(new ExpressError("Review not found", 404));
  if (review.author_id !== req.session.userId) {
    return next(new ExpressError("You do not have permission to do that", 403));
  }
  next();
}
