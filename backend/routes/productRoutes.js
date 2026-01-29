import { Router } from "express";

import {
  getProductsPublic,
  getProductsAdmin,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  reduceProductStock,
  getLowStockProducts,
  getOutOfStockProducts,
  getRelatedProducts,
  getRelatedProductsBySlug,
  getProductsByParentCategory,
} from "../controllers/productController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

/* =====================================================
   PUBLIC ROUTES (ORDER MATTERS!)
===================================================== */

// 👉 Products by parent category (Women / Men / Kids)
router.get("/parent/:slug", getProductsByParentCategory);

// 👉 All active products (with filters/search)
router.get("/public", getProductsPublic);

// 👉 Single product by slug
router.get("/slug/:slug", getProductBySlug);

// 👉 Related products (by slug)
router.get("/slug/:slug/related", getRelatedProductsBySlug);

// 👉 Related products (by product ID)
router.get("/:id/related", getRelatedProducts);

/* =====================================================
   ADMIN ROUTES
===================================================== */

// 👉 All products (admin)
router.get("/admin", authMiddleware, requireAdmin, getProductsAdmin);

// 👉 Low stock products
router.get(
  "/admin/low-stock",
  authMiddleware,
  requireAdmin,
  getLowStockProducts
);

// 👉 Out of stock products
router.get(
  "/admin/out-of-stock",
  authMiddleware,
  requireAdmin,
  getOutOfStockProducts
);

/* =====================================================
   INVENTORY MANAGEMENT
===================================================== */

// 👉 Reduce product stock
router.post(
  "/:id/reduce-stock",
  authMiddleware,
  requireAdmin,
  reduceProductStock
);

/* =====================================================
   ADMIN PRODUCT CRUD
===================================================== */

// 👉 Create product
router.post(
  "/",
  authMiddleware,
  requireAdmin,
  upload.array("images", 5),
  createProduct
);

// 👉 Update product
router.put(
  "/:id",
  authMiddleware,
  requireAdmin,
  upload.array("images", 5),
  updateProduct
);

// 👉 Delete product
router.delete("/:id", authMiddleware, requireAdmin, deleteProduct);

export default router;

