import express from "express";
import { getShippingMethods } from "../controllers/shippingController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/methods", authMiddleware, getShippingMethods);

export default router;