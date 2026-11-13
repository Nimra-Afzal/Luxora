import express from "express";
import { calculateTax } from "../controllers/taxController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/calculate", authMiddleware, calculateTax);

export default router;