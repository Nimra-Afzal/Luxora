import * as categoryService from "../services/categoryService.js";

/**
 * PUBLIC: Category tree
 */
export async function getCategoryTreePublic(req, res) {
  try {
    const tree = await categoryService.getCategoryTree({ admin: false });
    res.json(tree);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch category tree" });
  }
}

/**
 * ADMIN: Category tree
 */
export async function getCategoryTreeAdmin(req, res) {
  try {
    const tree = await categoryService.getCategoryTree({ admin: true });
    res.json(tree);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch category tree" });
  }
}

/**
 * PUBLIC: Flat categories
 */
export async function getCategoriesPublic(req, res) {
  try {
    const categories = await categoryService.getPublicCategories();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}

/**
 * PUBLIC: Get parent categories only
 */
export async function getParentCategoriesPublic(req, res) {
  try {
    const categories = await categoryService.getParentCategories({ admin: false });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch parent categories" });
  }
}

/**
 * PUBLIC: Get subcategories of a parent
 */
export async function getSubcategoriesPublic(req, res) {
  try {
    const { parentId } = req.params;
    const subcategories = await categoryService.getSubcategories(parentId, { admin: false });
    res.json(subcategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
}

/**
 * ADMIN: Get parent categories
 */
export async function getParentCategoriesAdmin(req, res) {
  try {
    const categories = await categoryService.getParentCategories({ admin: true });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch parent categories" });
  }
}

/**
 * ADMIN: Get subcategories of a parent
 */
export async function getSubcategoriesAdmin(req, res) {
  try {
    const { parentId } = req.params;
    const subcategories = await categoryService.getSubcategories(parentId, { admin: true });
    res.json(subcategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
}

/**
 * PUBLIC: Category by ID
 */
export async function getCategoryById(req, res) {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json({ category });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ error: err.message || "Failed to fetch category" });
  }
}

/**
 * PUBLIC: Category by slug
 */
export async function getCategoryBySlug(req, res) {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    res.json({ category });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ error: err.message || "Failed to fetch category" });
  }
}

/**
 * ADMIN: Create category
 */
export async function createCategory(req, res) {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ category });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Category with this name already exists under the selected parent",
      });
    }

    res
      .status(err.status || 500)
      .json({ error: err.message || "Failed to create category" });
  }
}

/**
 * ADMIN: Update category
 */
export async function updateCategory(req, res) {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    res.json({ category });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Category with this name already exists under the selected parent",
      });
    }

    res
      .status(err.status || 500)
      .json({ error: err.message || "Failed to update category" });
  }
}

/**
 * ADMIN: Delete category
 */
export async function deleteCategory(req, res) {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ error: err.message || "Failed to delete category" });
  }
}

/**
 * ADMIN: Categories with product count
 */
export async function getCategoriesWithProductCount(req, res) {
  try {
    const data = await categoryService.getCategoriesWithProductCount();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category statistics" });
  }
}

/**
 * ADMIN: Get all categories (flat list)
 */
export async function getAllCategoriesAdmin(req, res) {
  try {
    const categories = await categoryService.getAllCategoriesAdmin();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories (admin)" });
  }
}

/**
 * ADMIN: Get category statistics
 */
export async function getCategoryStats(req, res) {
  try {
    const stats = await categoryService.getCategoryStats();
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch category statistics" });
  }
}

/**
 * PUBLIC: Category breadcrumb (by slug)
 */
export async function getCategoryBreadcrumb(req, res) {
  try {
    const breadcrumb = await categoryService.getCategoryBreadcrumb({
      slug: req.params.slug,
    });

    res.json(breadcrumb);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ error: err.message || "Failed to generate breadcrumb" });
  }
}
