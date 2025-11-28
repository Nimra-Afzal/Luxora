import Product from "../models/product.js";
import Category from "../models/category.js";
import path from "path";
import fs from "fs";

/**
 * Helper to build absolute image URL (backend serves /uploads statically)
 */
function buildImageUrl(req, filename) {
  if (!filename) return null;
  const base = `${req.protocol}://${req.get("host")}`;
  // store path starting with /uploads/...
  return `${base}/uploads/${filename}`;
}

// Public: get all products (optional ?category=slug filter)
export async function getProductsPublic(req, res) {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) {
      // category may be slug — find category by slug
      const categoryDoc = await Category.findOne({ slug: category.toString().toLowerCase() });
      if (categoryDoc) filter.category = categoryDoc._id;
      else filter.category = null; // no results
    }
    const products = await Product.find(filter).populate("category", "name slug parent");
    res.json({ products });
  } catch (err) {
    console.error("❌ Failed to fetch products (public):", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

// Admin: get all products
export async function getProductsAdmin(req, res) {
  try {
    const products = await Product.find().populate("category", "name slug parent");
    res.json({ products });
  } catch (err) {
    console.error("❌ Failed to fetch products (admin):", err);
    res.status(500).json({ error: "Failed to fetch products (admin)" });
  }
}

// Get single product by ID
export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category", "name slug parent");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ product });
  } catch (err) {
    console.error("❌ Failed to fetch product by id:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
}

// Create product (admin)
export async function createProduct(req, res) {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: "Name, price and category are required" });
    }

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) return res.status(400).json({ error: "Selected category does not exist" });

    let image = null;
    if (req.file) {
      image = buildImageUrl(req, req.file.filename);
    }

    const product = new Product({
      name,
      description: description || "",
      price: Number(price),
      category: categoryDoc._id,
      image,
    });

    await product.save();
    const populated = await product.populate("category", "name slug parent");
    res.status(201).json({ product: populated });
  } catch (err) {
    console.error("❌ Error creating product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
}

// Update product (admin)
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.category = category ?? product.category;

    if (req.file) {
      // Note: product.image contains absolute url, but we store files in /uploads directory
      // If previous image file was stored locally and is not an external URL, attempt to delete its file.
      if (product.image && product.image.startsWith(`${req.protocol}://${req.get("host")}`)) {
        try {
          const urlPath = new URL(product.image).pathname; // /uploads/xxx.jpg
          const localPath = path.join(process.cwd(), urlPath); // full path
          if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
        } catch (e) {
          // ignore deletion errors
        }
      }
      product.image = buildImageUrl(req, req.file.filename);
    }

    await product.save();
    const populated = await product.populate("category", "name slug parent");
    res.json({ product: populated });
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
}

// Delete product (admin)
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // If image file is local, delete it
    if (product.image && product.image.startsWith(`${req.protocol}://${req.get("host")}`)) {
      try {
        const urlPath = new URL(product.image).pathname; // /uploads/xxx.jpg
        const localPath = path.join(process.cwd(), urlPath); // full path
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
      } catch (e) {
        // ignore
      }
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
}
