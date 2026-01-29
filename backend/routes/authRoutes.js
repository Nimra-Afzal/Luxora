import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  refreshToken,
  changePassword
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// --------------------------------------
// AUTH ROUTES
// --------------------------------------
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);


// --------------------------------------
// PROFILE ROUTES (Protected)
// --------------------------------------

// Get logged-in user's profile (no password returned)
router.get("/me", authMiddleware, getProfile);

// Update username, email, phone, address, avatar
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);


export default router;
