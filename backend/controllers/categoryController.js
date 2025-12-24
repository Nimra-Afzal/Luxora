// import Category from "../models/category.js";
// import slugify from "slugify";

// /**
//  * generate slug for category:
//  * - if parent exists, prefix with parent's slug to avoid slug collision between same names under different parents
//  */

// function buildCategoryTree(categories, parentId = null) {
//   return categories
//     .filter(cat => String(cat.parent) === String(parentId))
//     .sort((a, b) => a.displayOrder - b.displayOrder)
//     .map(cat => ({
//       _id: cat._id,
//       name: cat.name,
//       slug: cat.slug,
//       description: cat.description,
//       image: cat.image,
//       status: cat.status,
//       children: buildCategoryTree(categories, cat._id),
//     }));
// }

// export async function getCategoryTreePublic(req, res) {
//   try {
//     const categories = await Category.find({
//       status: "active",
//     }).lean();

//     const tree = buildCategoryTree(categories, null);
//     res.json(tree);
//   } catch (err) {
//     console.error("❌ Failed to fetch category tree:", err);
//     res.status(500).json({ error: "Failed to fetch category tree" });
//   }
// }

// async function buildSlug(name, parentId) {
//   const base = slugify(name, { lower: true, strict: true });
//   if (!parentId) return base;

//   const parent = await Category.findById(parentId).select("slug");
//   const parentSlug = parent ? parent.slug : null;
//   return parentSlug ? `${parentSlug}-${base}` : `${base}`;
// }

// // Create category or subcategory
// export async function createCategory(req, res) {
//   try {
//     const { name, parent } = req.body;
//     if (!name) return res.status(400).json({ error: "Name is required" });

//     const slug = await buildSlug(name, parent);

//     const category = new Category({ name, slug, parent: parent || null });
//     await category.save();
//     res.status(201).json({ category });
//   } catch (err) {
//     // Duplicate key - provide friendly message
//     if (err.code === 11000) {
//       return res.status(400).json({
//         error: "Category with this name already exists under the selected parent",
//       });
//     }
//     console.error("❌ Error creating category:", err);
//     res.status(500).json({ error: "Failed to create category" });
//   }
// }

// // Get all categories (public)
// export async function getCategoriesPublic(req, res) {
//   try {
//     // return lean objects so frontend can read quickly
//     const categories = await Category.find().select("name slug parent").lean();
//     res.json(categories);
//   } catch (err) {
//     console.error("❌ Failed to fetch categories (public):", err);
//     res.status(500).json({ error: "Failed to fetch categories" });
//   }
// }

// // Get single category by ID (public)
// export async function getCategoryById(req, res) {
//   try {
//     const { id } = req.params;
//     const category = await Category.findById(id).select("name slug parent");
//     if (!category) return res.status(404).json({ error: "Category not found" });
//     res.json({ category });
//   } catch (err) {
//     console.error("❌ Failed to fetch category by id:", err);
//     res.status(500).json({ error: "Failed to fetch category" });
//   }
// }

// // Update category
// export async function updateCategory(req, res) {
//   try {
//     const { id } = req.params;
//     const { name, parent } = req.body;

//     const category = await Category.findById(id);
//     if (!category) return res.status(404).json({ error: "Category not found" });

//     if (name) {
//       category.name = name;
//       category.slug = await buildSlug(name, parent || category.parent);
//     }

//     category.parent = parent || null;

//     await category.save();
//     res.json({ category });
//   } catch (err) {
//     if (err.code === 11000) {
//       return res.status(400).json({
//         error: "Category with this name already exists under the selected parent",
//       });
//     }
//     console.error("❌ Failed to update category:", err);
//     res.status(500).json({ error: "Failed to update category" });
//   }
// }

// // Delete category
// export async function deleteCategory(req, res) {
//   try {
//     const { id } = req.params;
//     const category = await Category.findByIdAndDelete(id);
//     if (!category) return res.status(404).json({ error: "Category not found" });
//     res.json({ message: "Category deleted" });
//   } catch (err) {
//     console.error("❌ Failed to delete category:", err);
//     res.status(500).json({ error: "Failed to delete category" });
//   }
// }

import Category from "../models/category.js";
import slugify from "slugify";

/**
 * Build category tree (recursive)
 */
function buildCategoryTree(categories, parentId = null) {
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
      children: buildCategoryTree(categories, cat._id),
    }));
}

/**
 * Public: Get category tree (ACTIVE only)
 */
export async function getCategoryTreePublic(req, res) {
  try {
    const categories = await Category.find({ status: "active" }).lean();
    const tree = buildCategoryTree(categories, null);
    res.json(tree);
  } catch (err) {
    console.error("❌ Failed to fetch category tree:", err);
    res.status(500).json({ error: "Failed to fetch category tree" });
  }
}

/**
 * Generate slug (parent-aware)
 */
async function buildSlug(name, parentId) {
  const base = slugify(name, { lower: true, strict: true });
  if (!parentId) return base;

  const parent = await Category.findById(parentId).select("slug");
  return parent ? `${parent.slug}-${base}` : base;
}

/**
 * Admin: Create category
 */
export async function createCategory(req, res) {
  try {
    const { name, parent, description, image, status, displayOrder } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

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
    res.status(201).json({ category });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Category with this name already exists under the selected parent",
      });
    }
    console.error("❌ Error creating category:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
}

/**
 * Public: Get all ACTIVE categories (flat)
 */
export async function getCategoriesPublic(req, res) {
  try {
    const categories = await Category.find({ status: "active" })
      .select("name slug parent")
      .lean();

    res.json(categories);
  } catch (err) {
    console.error("❌ Failed to fetch categories (public):", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}

/**
 * Public: Get category by ID
 */
export async function getCategoryById(req, res) {
  try {
    const { id } = req.params;

    const category = await Category.findById(id).lean();
    if (!category) return res.status(404).json({ error: "Category not found" });

    res.json({ category });
  } catch (err) {
    console.error("❌ Failed to fetch category by id:", err);
    res.status(500).json({ error: "Failed to fetch category" });
  }
}

/**
 * Public: Get category by SLUG (STEP 3)
 */
export async function getCategoryBySlug(req, res) {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({
      slug,
      status: "active",
    }).lean();

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ category });
  } catch (err) {
    console.error("❌ Failed to fetch category by slug:", err);
    res.status(500).json({ error: "Failed to fetch category" });
  }
}

/**
 * Admin: Update category
 */
export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, parent, description, image, status, displayOrder } = req.body;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    if (name) {
      category.name = name;
      category.slug = await buildSlug(name, parent || category.parent);
    }

    if (parent !== undefined) category.parent = parent || null;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (status !== undefined) category.status = status;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;

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

/**
 * Admin: Delete category
 */
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

import Product from "../models/product.js";

/**
 * Admin: Get categories with product count
 */
export async function getCategoriesWithProductCount(req, res) {
  try {
    const categories = await Category.find().lean();

    const categoriesWithCount = await Promise.all(
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

    res.json(categoriesWithCount);
  } catch (err) {
    console.error("❌ Failed to fetch categories with product count:", err);
    res.status(500).json({ error: "Failed to fetch category statistics" });
  }
}
/**
 * Admin: Get full category tree (active + inactive)
 */
export async function getCategoryTreeAdmin(req, res) {
  try {
    const categories = await Category.find().lean();
    const tree = buildCategoryTree(categories, null);
    res.json(tree);
  } catch (err) {
    console.error("❌ Failed to fetch admin category tree:", err);
    res.status(500).json({ error: "Failed to fetch category tree" });
  }
}

