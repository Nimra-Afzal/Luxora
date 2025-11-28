export function requireAdmin(req, res, next) {
  console.log("👉 requireAdmin check:", req.user);

  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Forbidden: admin only",
      user: req.user, // debug info
    });
  }
  next();
}
