import { Router } from "express";
import { User } from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ExpressError } from "../utils/ExpressError.js";

const router = Router();

router.post(
  "/register",
  catchAsync(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new ExpressError("Username, email and password are required", 400);
    }
    if (password.length < 6) {
      throw new ExpressError("Password must be at least 6 characters", 400);
    }
    if (User.findByUsername(username)) {
      throw new ExpressError("Username is already taken", 400);
    }
    if (User.findByEmail(email)) {
      throw new ExpressError("Email is already registered", 400);
    }
    const user = User.create({ username, email, password });
    req.session.userId = user.id;
    res.status(201).json({ user });
  })
);

router.post(
  "/login",
  catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const user = User.findByUsername(username);
    if (!user || !User.verifyPassword(user, password)) {
      throw new ExpressError("Invalid username or password", 401);
    }
    req.session.userId = user.id;
    res.json({ user: User.toPublic(user) });
  })
);

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

router.get("/me", (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const user = User.findById(req.session.userId);
  res.json({ user: user || null });
});

export default router;
