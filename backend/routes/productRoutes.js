import { Router } from "express";
import {
  getProductsPublic,
  getProductsAdmin,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { upload } from "../middlewares/upload.js";
import { reduceProductStock } from "../controllers/productController.js";
import { getLowStockProducts} from "../controllers/productController.js";
import { getRelatedProducts} from "../controllers/productController.js";
import { getRelatedProductsBySlug } from "../controllers/productController.js";
import { getOutOfStockProducts } from "../controllers/productController.js";

const router = Router();

// -------- PUBLIC ROUTES --------

// Get all active products
router.get("/public", getProductsPublic);

// Get single active product by SLUG
router.get("/slug/:slug", getProductBySlug);

// -------- ADMIN ROUTES --------

// Get all products (admin)
router.get("/admin", authMiddleware, requireAdmin, getProductsAdmin);
router.get(
  "/admin/low-stock",
  authMiddleware,
  requireAdmin,
  getLowStockProducts
);
router.get("/:id/related", getRelatedProducts);
// Related products (customer)
router.get("/slug/:slug/related", getRelatedProductsBySlug);
router.get(
  "/admin/out-of-stock",
  authMiddleware,
  requireAdmin,
  getOutOfStockProducts
);




// -------- ADMIN PRODUCT ACTIONS --------
router.post(
  "/:id/reduce-stock",
  authMiddleware,
  requireAdmin,
  async (req, res) => {
    try {
      const { quantity } = req.body;

      const product = await reduceProductStock(
        req.params.id,
        Number(quantity)
      );

      res.json({ product });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Create product
// router.post("/", authMiddleware, requireAdmin, createProduct);
router.post(
  "/",
  authMiddleware,
  requireAdmin,
  upload.array("images", 5), // max 5 images
  createProduct
);


// Update product
// router.put("/:id", authMiddleware, requireAdmin, updateProduct);
router.put(
  "/:id",
  authMiddleware,
  requireAdmin,
  upload.array("images", 5),
  updateProduct
);


// Delete product
router.delete("/:id", authMiddleware, requireAdmin, deleteProduct);

export default router;
