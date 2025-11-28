import { Router } from "express";
import {
  createCategory,
  getCategoriesPublic,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

// Public
router.get("/public", getCategoriesPublic);
router.get("/:id", getCategoryById);

// Admin
router.post("/", authMiddleware, requireAdmin, createCategory);
router.put("/:id", authMiddleware, requireAdmin, updateCategory);
router.delete("/:id", authMiddleware, requireAdmin, deleteCategory);

export default router;
