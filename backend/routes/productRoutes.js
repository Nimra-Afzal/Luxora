import { Router } from "express";
import {
  getProductsPublic,
  getProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

// -------- PUBLIC ROUTES --------

// Get all products (optional ?category=slug)
router.get("/public", getProductsPublic);

// Get single product by ID
router.get("/:id", getProductById);

// -------- ADMIN ROUTES --------

// Get all products (admin)
router.get("/admin", authMiddleware, requireAdmin, getProductsAdmin);

// Create product
router.post("/", authMiddleware, requireAdmin, createProduct);

// Update product
router.put("/:id", authMiddleware, requireAdmin, updateProduct);

// Delete product
router.delete("/:id", authMiddleware, requireAdmin, deleteProduct);

export default router;
