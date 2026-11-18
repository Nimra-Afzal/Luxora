
import express from "express";
import {
  createOrder,
  createPaymentIntent,
  getOrderPaymentStatus,
} from "../controllers/orderController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/:orderId/payment-status",
  authMiddleware,
  getOrderPaymentStatus
);

router.post("/create-payment-intent", authMiddleware, createPaymentIntent);
router.post("/", authMiddleware, createOrder);

export default router;
