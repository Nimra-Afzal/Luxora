import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = Router();

// Create review
router.post("/", authMiddleware, createReview);

// Delete review
router.delete("/:id", authMiddleware, deleteReview);

export default router;
