import path from "path";
import fs from "fs";

/* multer will handle the file save; here we return public URL */
export function uploadImage(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    // Build absolute public URL
    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    return res.json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message });
  }
}
