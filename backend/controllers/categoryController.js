import Category from "../models/category.js";
import slugify from "slugify";

/**
 * generate slug for category:
 * - if parent exists, prefix with parent's slug to avoid slug collision between same names under different parents
 */
async function buildSlug(name, parentId) {
  const base = slugify(name, { lower: true, strict: true });
  if (!parentId) return base;

  const parent = await Category.findById(parentId).select("slug");
  const parentSlug = parent ? parent.slug : null;
  return parentSlug ? `${parentSlug}-${base}` : `${base}`;
}

// Create category or subcategory
export async function createCategory(req, res) {
  try {
    const { name, parent } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const slug = await buildSlug(name, parent);

    const category = new Category({ name, slug, parent: parent || null });
    await category.save();
    res.status(201).json({ category });
  } catch (err) {
    // Duplicate key - provide friendly message
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Category with this name already exists under the selected parent",
      });
    }
    console.error("❌ Error creating category:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
}

// Get all categories (public)
export async function getCategoriesPublic(req, res) {
  try {
    // return lean objects so frontend can read quickly
    const categories = await Category.find().select("name slug parent").lean();
    res.json(categories);
  } catch (err) {
    console.error("❌ Failed to fetch categories (public):", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}

// Get single category by ID (public)
export async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).select("name slug parent");
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ category });
  } catch (err) {
    console.error("❌ Failed to fetch category by id:", err);
    res.status(500).json({ error: "Failed to fetch category" });
  }
}

// Update category
export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, parent } = req.body;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    if (name) {
      category.name = name;
      category.slug = await buildSlug(name, parent || category.parent);
    }

    category.parent = parent || null;

    await category.save();
    res.json({ category });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Category with this name already exists under the selected parent",
      });
    }
    console.error("❌ Failed to update category:", err);
    res.status(500).json({ error: "Failed to update category" });
  }
}

// Delete category
export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error("❌ Failed to delete category:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
}
