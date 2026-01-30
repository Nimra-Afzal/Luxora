import Category from "../models/category.js";
import Product from "../models/product.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";

// Maximum depth for category hierarchy (Parent > Subcategory)
const MAX_DEPTH = 2;

/**
 * Build category tree (recursive)
 */
export function buildCategoryTree(categories, parentId = null) {
  return categories
    .filter((cat) => String(cat.parent || null) === String(parentId))
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((cat) => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      status: cat.status,
      displayOrder: cat.displayOrder,
      parent: cat.parent,
      children: buildCategoryTree(categories, cat._id),
    }));
}

/**
 * Generate slug (parent-aware)
 */
export async function buildSlug(name, parentId) {
  const base = slugify(name, { lower: true, strict: true });

  if (!parentId) return base;

  const parent = await Category.findById(parentId).select("slug");
  return parent ? `${parent.slug}-${base}` : base;
}

/**
 * Extract Cloudinary public_id from URL
 */
function extractPublicId(url) {
  if (!url) return null;
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename.split(".")[0];
}

/**
 * Check if category can have children (must be a parent category)
 */
async function canHaveChildren(categoryId) {
  const category = await Category.findById(categoryId);
  if (!category) return false;
  // Only root categories (no parent) can have children
  return category.parent === null;
}

/**
 * Check if setting parent would create circular reference
 */
async function wouldCreateCircularReference(categoryId, newParentId) {
  if (!newParentId) return false;
  if (String(categoryId) === String(newParentId)) return true;

  // Check if newParentId is a descendant of categoryId
  const descendants = await getAllDescendants(categoryId);
  return descendants.some((d) => String(d._id) === String(newParentId));
}

/**
 * Get all descendants of a category
 */
async function getAllDescendants(categoryId) {
  const children = await Category.find({ parent: categoryId }).lean();
  let descendants = [...children];

  for (const child of children) {
    const childDescendants = await getAllDescendants(child._id);
    descendants = [...descendants, ...childDescendants];
  }

  return descendants;
}

/**
 * Validate parent category
 */
async function validateParent(parentId, currentCategoryId = null) {
  if (!parentId) return { valid: true };

  const parent = await Category.findById(parentId);

  if (!parent) {
    return { valid: false, message: "Parent category not found" };
  }

  // Parent must be a root category (no grandparents allowed - max 2 levels)
  if (parent.parent !== null) {
    return {
      valid: false,
      message: "Cannot create subcategory under another subcategory. Maximum depth is 2 levels.",
    };
  }

  // Check for circular reference when updating
  if (currentCategoryId) {
    const isCircular = await wouldCreateCircularReference(currentCategoryId, parentId);
    if (isCircular) {
      return {
        valid: false,
        message: "Cannot set parent: would create circular reference",
      };
    }
  }

  return { valid: true };
}

/**
 * Create category
 */
export async function createCategory(data) {
  const { name, parent, description, image, status, displayOrder } = data;

  if (!name || !name.trim()) {
    throw { status: 400, message: "Category name is required" };
  }

  // Validate parent
  const parentValidation = await validateParent(parent);
  if (!parentValidation.valid) {
    throw { status: 400, message: parentValidation.message };
  }

  const slug = await buildSlug(name, parent);

  const category = new Category({
    name: name.trim(),
    slug,
    parent: parent || null,
    description: description?.trim() || "",
    image: image || null,
    status: status || "active",
    displayOrder: displayOrder || 0,
  });

  await category.save();
  return category;
}

/**
 * Update category (with validation)
 */
export async function updateCategory(id, data) {
  const category = await Category.findById(id);
  if (!category) {
    throw { status: 404, message: "Category not found" };
  }

  const { name, parent, description, image, status, displayOrder } = data;

  // Validate parent change
  if (parent !== undefined && String(parent || null) !== String(category.parent || null)) {
    const parentValidation = await validateParent(parent, id);
    if (!parentValidation.valid) {
      throw { status: 400, message: parentValidation.message };
    }

    // If changing from parent to subcategory, check if it has children
    if (parent && category.parent === null) {
      const hasChildren = await Category.exists({ parent: category._id });
      if (hasChildren) {
        throw {
          status: 400,
          message: "Cannot convert to subcategory: this category has subcategories. Delete or move them first.",
        };
      }
    }
  }

  if (name) {
    category.name = name.trim();
    category.slug = await buildSlug(name, parent ?? category.parent);
  }

  if (parent !== undefined) category.parent = parent || null;
  if (description !== undefined) category.description = description?.trim() || "";

  // Handle image replacement
  if (image && category.image && image !== category.image) {
    try {
      const publicId = extractPublicId(category.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (err) {
      console.warn("Failed to delete old category image:", err.message);
    }
    category.image = image;
  } else if (image !== undefined) {
    category.image = image;
  }

  if (status !== undefined) category.status = status;
  if (displayOrder !== undefined) category.displayOrder = displayOrder;

  await category.save();
  return category;
}

/**
 * Delete category (with cascade handling)
 */
export async function deleteCategory(id) {
  const category = await Category.findById(id);
  if (!category) {
    throw { status: 404, message: "Category not found" };
  }

  // Check if category has children
  const hasChildren = await Category.exists({ parent: category._id });
  if (hasChildren) {
    throw {
      status: 400,
      message: "Cannot delete category with subcategories. Delete subcategories first.",
    };
  }

  // Check if category has products
  const hasProducts = await Product.exists({ category: category._id });
  if (hasProducts) {
    throw {
      status: 400,
      message: "Cannot delete category with products. Move or delete products first.",
    };
  }

  // Delete category image from Cloudinary
  if (category.image) {
    try {
      const publicId = extractPublicId(category.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (err) {
      console.warn("Failed to delete category image:", err.message);
    }
  }

  await category.deleteOne();
}

/**
 * Get category tree
 */
export async function getCategoryTree({ admin = false }) {
  const filter = admin ? {} : { status: "active" };
  const categories = await Category.find(filter).lean();
  return buildCategoryTree(categories, null);
}

/**
 * Get flat active categories (for product forms)
 */
export async function getPublicCategories() {
  return Category.find({ status: "active" })
    .select("name slug parent")
    .sort({ displayOrder: 1, name: 1 })
    .lean();
}

/**
 * Get parent categories only (categories without parent)
 */
export async function getParentCategories({ admin = false }) {
  const filter = admin ? { parent: null } : { parent: null, status: "active" };
  return Category.find(filter)
    .select("name slug description image status displayOrder")
    .sort({ displayOrder: 1, name: 1 })
    .lean();
}

/**
 * Get subcategories of a parent
 */
export async function getSubcategories(parentId, { admin = false }) {
  const filter = admin
    ? { parent: parentId }
    : { parent: parentId, status: "active" };

  return Category.find(filter)
    .select("name slug description image status displayOrder parent")
    .sort({ displayOrder: 1, name: 1 })
    .lean();
}

/**
 * Get category by ID
 */
export async function getCategoryById(id) {
  const category = await Category.findById(id)
    .populate("parent", "name slug")
    .lean();

  if (!category) {
    throw { status: 404, message: "Category not found" };
  }
  return category;
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug) {
  const category = await Category.findOne({
    slug,
    status: "active",
  })
    .populate("parent", "name slug")
    .lean();

  if (!category) {
    throw { status: 404, message: "Category not found" };
  }

  return category;
}

/**
 * Generate breadcrumb for a category (optimized)
 */
export async function getCategoryBreadcrumb({ id, slug }) {
  let category;

  if (id) {
    category = await Category.findById(id).populate("parent", "name slug").lean();
  } else if (slug) {
    category = await Category.findOne({ slug, status: "active" })
      .populate("parent", "name slug")
      .lean();
  }

  if (!category) {
    throw { status: 404, message: "Category not found" };
  }

  const breadcrumb = [
    {
      _id: category._id,
      name: category.name,
      slug: category.slug,
    },
  ];

  // Add parent if exists (max 2 levels so only one parent possible)
  if (category.parent) {
    breadcrumb.unshift({
      _id: category.parent._id,
      name: category.parent.name,
      slug: category.parent.slug,
    });
  }

  return breadcrumb;
}

/**
 * ADMIN: Get all categories (flat) with parent populated
 */
export async function getAllCategoriesAdmin() {
  return Category.find()
    .populate("parent", "name slug")
    .sort({ parent: 1, displayOrder: 1, name: 1 })
    .lean();
}

/**
 * Categories with product count
 */
export async function getCategoriesWithProductCount() {
  const categories = await Category.find()
    .populate("parent", "name slug")
    .lean();

  return Promise.all(
    categories.map(async (category) => {
      const productCount = await Product.countDocuments({
        category: category._id,
      });

      return {
        ...category,
        productCount,
      };
    })
  );
}

/**
 * Get category statistics for admin dashboard
 */
export async function getCategoryStats() {
  const totalCategories = await Category.countDocuments();
  const parentCategories = await Category.countDocuments({ parent: null });
  const subcategories = totalCategories - parentCategories;
  const activeCategories = await Category.countDocuments({ status: "active" });
  const inactiveCategories = totalCategories - activeCategories;

  return {
    total: totalCategories,
    parents: parentCategories,
    subcategories,
    active: activeCategories,
    inactive: inactiveCategories,
  };
}
