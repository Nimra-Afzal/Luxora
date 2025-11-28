import * as blogService from "../services/blogService.js";

// ✅ Create blog
export async function create(req, res) {
  try {
    const { title, content, image } = req.body;
    if (!title || !content)
      return res.status(400).json({ error: "Title and content required" });

    const authorId = req.user?.id;
    const blog = await blogService.createBlog({ title, content, image, author: authorId });
    const blogPopulated = await blog.populate("author", "username");
    return res.status(201).json({ blog: blogPopulated });
  } catch (err) {
    console.error("Create blog error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}

// ✅ Get my blogs
export async function getMy(req, res) {
  try {
    const authorId = req.user?.id;
    const blogs = await blogService.getMyBlogs(authorId);
    return res.json({ blogs });
  } catch (err) {
    console.error("Get my blogs error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// ✅ Get all blogs (public)
export async function getAll(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await blogService.getAllBlogs({ page, limit });
    return res.json(result);
  } catch (err) {
    console.error("Get all blogs error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// ✅ Update blog
export async function update(req, res) {
  try {
    const { id } = req.params;
    const authorId = req.user?.id;
    const updated = await blogService.updateBlog(id, authorId, req.body);
    return res.json({ blog: updated });
  } catch (err) {
    console.error("Update blog error:", err);
    if (err.message === "Blog not found") return res.status(404).json({ error: "Not found" });
    if (err.message === "Not authorized") return res.status(403).json({ error: "Forbidden" });
    return res.status(500).json({ error: "Server error" });
  }
}

// ✅ Delete blog
export async function remove(req, res) {
  try {
    const { id } = req.params;
    const authorId = req.user?.id;
    await blogService.deleteBlog(id, authorId);
    return res.json({ success: true });
  } catch (err) {
    console.error("Delete blog error:", err);
    if (err.message === "Blog not found") return res.status(404).json({ error: "Not found" });
    if (err.message === "Not authorized") return res.status(403).json({ error: "Forbidden" });
    return res.status(500).json({ error: "Server error" });
  }
}
