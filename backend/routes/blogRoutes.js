// backend/routes/blogRoutes.js
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as blogController from "../controllers/blogController.js";

const router = Router();

// Public: list all blogs
router.get("/public", blogController.getAll);

// Protected: CRUD
router.get("/my", authMiddleware, blogController.getMy);
router.post("/", authMiddleware, blogController.create);
router.put("/:id", authMiddleware, blogController.update);
router.delete("/:id", authMiddleware, blogController.remove);

export default router;
