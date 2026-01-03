import Product from "../models/product.js";
import Category from "../models/category.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";

/* =====================================================
   PUBLIC CONTROLLERS (CUSTOMERS)
===================================================== */
const LOW_STOCK_THRESHOLD = 5;

function isLowStock(stock) {
  return stock <= LOW_STOCK_THRESHOLD;
}

// Get all ACTIVE products with search & filters
export async function getProductsPublic(req, res) {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
    } = req.query;

    let filter = { status: "active" };

    // 🔍 Search by product name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // 🗂️ Filter by category slug
    if (category) {
      const categoryDoc = await Category.findOne({
        slug: category.toLowerCase(),
      });
      if (!categoryDoc) {
        return res.json({ products: [] });
      }
      filter.category = categoryDoc._id;
    }

    // 💰 Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter)
      .populate("category", "name slug parent")
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (err) {
    console.error("❌ Product filter error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

// Get single ACTIVE product by SLUG
export async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({
      slug,
      status: "active",
    }).populate("category", "name slug parent");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product });
  } catch (err) {
    console.error("❌ Failed to fetch product by slug:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
}

/* =====================================================
   ADMIN CONTROLLERS
===================================================== */

// Admin: get all products (active + inactive)
export async function getProductsAdmin(req, res) {
  try {
    const products = await Product.find()
      .populate("category", "name slug parent")
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (err) {
    console.error("❌ Failed to fetch products (admin):", err);
    res.status(500).json({ error: "Failed to fetch products (admin)" });
  }
}

// Admin: create product
export async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      sku,
      barcode,
      status,
      metaTitle,
      metaKeywords,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        error: "Name, price and category are required",
      });
    }

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existing = await Product.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: "Product already exists" });
    }

    // Upload images to Cloudinary
    let images = [];
    let primaryImage = "";

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "products" }
        );
        images.push(result.secure_url);
      }
      primaryImage = images[0];
    }

    const product = new Product({
      name,
      slug,
      description: description || "",
      price: Number(price),
      category,
      stock: Number(stock) || 0,
      sku: sku || "",
      barcode: barcode || "",
      images,
      primaryImage,
      status: status || "active",
      metaTitle: metaTitle || "",
      metaKeywords: metaKeywords
        ? metaKeywords.split(",").map((k) => k.trim())
        : [],
    });

    await product.save();

    res.status(201).json({ product });
  } catch (err) {
    console.error("❌ Create product error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
}

// Admin: update product
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      stock,
      sku,
      barcode,
      status,
      metaTitle,
      metaKeywords,
    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (name && name !== product.name) {
      product.name = name;
      product.slug = slugify(name, { lower: true, strict: true });
    }

    product.description = description ?? product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.category = category ?? product.category;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.sku = sku ?? product.sku;
    product.barcode = barcode ?? product.barcode;
    product.status = status ?? product.status;
    product.metaTitle = metaTitle ?? product.metaTitle;
    product.metaKeywords = metaKeywords
      ? metaKeywords.split(",").map((k) => k.trim())
      : product.metaKeywords;

    // Upload new images (if any)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "products" }
        );
        product.images.push(result.secure_url);
      }

      if (!product.primaryImage) {
        product.primaryImage = product.images[0];
      }
    }

    await product.save();

    const populated = await product.populate(
      "category",
      "name slug parent"
    );

    res.json({ product: populated });
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
}

// Admin: delete product
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // (Optional later: delete images from Cloudinary using public_id)

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
}


export async function reduceProductStock(req, res) {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    product.stock -= quantity;
    await product.save();

    const lowStock = isLowStock(product.stock);

    res.json({
      message: "Stock reduced successfully",
      stock: product.stock,
      lowStock,
      warning: lowStock
        ? "⚠️ Low stock alert"
        : null,
    });
  } catch (err) {
    console.error("❌ Reduce stock error:", err);
    res.status(500).json({ error: "Failed to reduce stock" });
  }
}

export async function getLowStockProducts(req, res) {
  try {
    const products = await Product.find({
      stock: { $lte: LOW_STOCK_THRESHOLD },
      status: "active",
    }).populate("category", "name slug");

    res.json({
      count: products.length,
      products,
    });
  } catch (err) {
    console.error("❌ Low stock fetch error:", err);
    res.status(500).json({ error: "Failed to fetch low stock products" });
  }
}

// GET RELATED PRODUCTS
export async function getRelatedProducts(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      status: "active",
    })
      .limit(4)
      .populate("category", "name slug");

    res.json({ products: relatedProducts });
  } catch (err) {
    console.error("❌ Related products error:", err);
    res.status(500).json({ error: "Failed to fetch related products" });
  }
}

// GET RELATED PRODUCTS BY SLUG (Customer-friendly)
export async function getRelatedProductsBySlug(req, res) {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({
      slug,
      status: "active",
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      status: "active",
    })
      .limit(4)
      .populate("category", "name slug");

    res.json({ products: relatedProducts });
  } catch (err) {
    console.error("❌ Related products error:", err);
    res.status(500).json({ error: "Failed to fetch related products" });
  }
}

export async function getOutOfStockProducts(req, res) {
  try {
    const products = await Product.find({
      stock: 0,
      status: "active",
    }).populate("category", "name slug");

    res.json({
      count: products.length,
      products,
    });
  } catch (err) {
    console.error("❌ Out of stock fetch error:", err);
    res.status(500).json({ error: "Failed to fetch out of stock products" });
  }
}



