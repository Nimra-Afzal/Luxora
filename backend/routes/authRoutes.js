// import { Router } from "express";
// import { register, login } from "../controllers/authController.js";
// import { authMiddleware } from "../middlewares/authMiddleware.js";

// const router = Router();

// router.post("/register", register);
// router.post("/login", login);
// router.get("/me", authMiddleware, (req, res) => res.json({ user: req.user }));

// export default router;

import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// --------------------------------------
// AUTH ROUTES
// --------------------------------------
router.post("/register", register);
router.post("/login", login);

// --------------------------------------
// PROFILE ROUTES (Protected)
// --------------------------------------

// Get logged-in user's profile (no password returned)
router.get("/me", authMiddleware, getProfile);

// Update username, email, phone, address, avatar
router.put("/profile", authMiddleware, updateProfile);

export default router;
