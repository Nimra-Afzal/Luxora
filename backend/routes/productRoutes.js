import { Router } from "express";
import * as cc from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

// --- PUBLIC ROUTES ---
router.get("/public", cc.getCategoriesPublic);        // GET all categories for dropdowns
router.get("/:id", cc.getCategoryById);               // GET single category by id

// --- ADMIN ROUTES ---
router.post("/", authMiddleware, requireAdmin, cc.createCategory);       // CREATE
router.put("/:id", authMiddleware, requireAdmin, cc.updateCategory);     // UPDATE
router.delete("/:id", authMiddleware, requireAdmin, cc.deleteCategory);  // DELETE

export default router;
