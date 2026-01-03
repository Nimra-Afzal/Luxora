import { Router } from "express";
import {
  createCategory,
  getCategoriesPublic,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryTreePublic,
  getCategoryBySlug,
  getCategoriesWithProductCount,
   getCategoryTreeAdmin,
} from "../controllers/categoryController.js";


import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

/**
 * PUBLIC ROUTES (specific → generic)
 */
router.get("/public/tree", getCategoryTreePublic);
router.get("/public", getCategoriesPublic);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategoryById);

/**
 * ADMIN ROUTES
 */
router.post("/", authMiddleware, requireAdmin, createCategory);
router.get(
  "/admin/with-product-count",
  authMiddleware,
  requireAdmin,
  getCategoriesWithProductCount
);
router.get(
  "/admin/tree",
  authMiddleware,
  requireAdmin,
  getCategoryTreeAdmin
);


router.put("/:id", authMiddleware, requireAdmin, updateCategory);
router.delete("/:id", authMiddleware, requireAdmin, deleteCategory);

export default router;
