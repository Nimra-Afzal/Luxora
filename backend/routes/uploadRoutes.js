import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { uploadImage } from "../controllers/uploadController.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ensure uploads dir exists
const uploadDir = path.join(__dirname, "../uploads");
import fs from "fs";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), uploadImage);

export default router;
