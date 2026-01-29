import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { getUsers, deleteUser,  updateUser } from "../controllers/userController.js";

const router = Router();

router.get("/", authMiddleware, requireAdmin, getUsers);
router.put("/:id", authMiddleware, requireAdmin, updateUser);
router.delete("/:id", authMiddleware, requireAdmin, deleteUser);

export default router;
