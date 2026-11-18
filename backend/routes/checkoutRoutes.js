import express from "express";
import { validateCheckout } from "../controllers/checkoutController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/validate", authMiddleware, validateCheckout);

export default router;