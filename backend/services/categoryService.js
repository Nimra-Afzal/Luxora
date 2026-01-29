import Category from "../models/category.js";
import Product from "../models/product.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";

/**
 * Build category tree (recursive)
 */
export function buildCategoryTree(categories, parentId = null) {
  return categories
    .filter(cat => String(cat.parent) === String(parentId))
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(cat => ({
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
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename.split(".")[0];
}

/**
 * Create category
 */
export async function createCategory(data) {
  const { name, parent, description, image, status, displayOrder } = data;

  if (!name) {
    throw { status: 400, message: "Name is required" };
  }

  const slug = await buildSlug(name, parent);

  const category = new Category({
    name,
    slug,
    parent: parent || null,
    description,
    image,
    status,
    displayOrder,
  });

  await category.save();
  return category;
}

/**
 * Update category (with SAFE image replace)
 */
export async function updateCategory(id, data) {
  const category = await Category.findById(id);
  if (!category) {
    throw { status: 404, message: "Category not found" };
  }

  const { name, parent, description, image, status, displayOrder } = data;

  if (name) {
    category.name = name;
    category.slug = await buildSlug(name, parent ?? category.parent);
  }

  if (parent !== undefined) category.parent = parent || null;
  if (description !== undefined) category.description = description;

  // ✅ SAFE IMAGE REPLACEMENT
  if (image && category.image && image !== category.image) {
    try {
      const publicId = extractPublicId(category.image);
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.warn(
        "⚠️ Failed to delete old category image:",
        err.message
      );
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
 * Delete category (with SAFE Cloudinary delete)
 */
export async function deleteCategory(id) {
  const category = await Category.findById(id);
  if (!category) {
    throw { status: 404, message: "Category not found" };
  }

  if (category.image) {
    try {
      const publicId = extractPublicId(category.image);
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.warn(
        "⚠️ Failed to delete category image:",
        err.message
      );
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
 * Get flat active categories
 */
export async function getPublicCategories() {
  return Category.find({ status: "active" })
    .select("name slug parent")
    .lean();
}

/**
 * Get category by ID
 */
export async function getCategoryById(id) {
  const category = await Category.findById(id).lean();
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
  }).lean();

  if (!category) {
    throw { status: 404, message: "Category not found" };
  }

  return category;
}

/**
 * Generate breadcrumb for a category (by ID or slug)
 */
export async function getCategoryBreadcrumb({ id, slug }) {
  let category;

  if (id) {
    category = await Category.findById(id).lean();
  } else if (slug) {
    category = await Category.findOne({ slug, status: "active" }).lean();
  }

  if (!category) {
    throw { status: 404, message: "Category not found" };
  }

  const breadcrumb = [];
  let current = category;

  while (current) {
    breadcrumb.push({
      _id: current._id,
      name: current.name,
      slug: current.slug,
    });

    if (!current.parent) break;

    current = await Category.findById(current.parent).lean();
  }

  return breadcrumb.reverse();
}

/**
 * ADMIN: Get all categories (flat)
 */
export async function getAllCategoriesAdmin() {
  return Category.find()
    .populate("parent", "name slug")
    .sort({ createdAt: -1 })
    .lean();
}


/**
 * Categories with product count
 */
export async function getCategoriesWithProductCount() {
  const categories = await Category.find().lean();

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
