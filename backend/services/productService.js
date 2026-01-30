import Product from "../models/product.js";
import Category from "../models/category.js";
import slugify from "slugify";

const LOW_STOCK_THRESHOLD = 5;

export function isLowStock(stock) {
  return stock <= LOW_STOCK_THRESHOLD;
}

/* =====================================================
   PUBLIC SERVICES
===================================================== */

export async function getPublicProductsService(query) {
  const { search, category, minPrice, maxPrice } = query;

  let filter = { status: "active" };

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (category) {
    const categoryDoc = await Category.findOne({
      slug: category.toLowerCase(),
    });

    if (!categoryDoc) return [];

    filter.category = categoryDoc._id;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  return Product.find(filter)
    .populate("category", "name slug parent")
    .sort({ createdAt: -1 });
}

export async function getProductBySlugService(slug) {
  return Product.findOne({ slug, status: "active" })
    .populate("category", "name slug parent");
}

/* =====================================================
   ADMIN SERVICES
===================================================== */

export async function getAdminProductsService() {
  return Product.find()
    .populate("category", "name slug parent")
    .sort({ createdAt: -1 });
}

export async function createProductService(data) {
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
    images,
  } = data;

  const slug = slugify(name, { lower: true, strict: true });

  const exists = await Product.findOne({ slug });
  if (exists) throw new Error("Product already exists");

  return Product.create({
    name,
    slug,
    description: description || "",
    price: Number(price),
    category,
    stock: Number(stock) || 0,
    sku: sku || "",
    barcode: barcode || "",
    images,
    primaryImage: images[0] || "",
    status: status || "active",
    metaTitle: metaTitle || "",
    metaKeywords: metaKeywords || [],
  });
}

export async function updateProductService(id, updates, newImages = []) {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  if (updates.name && updates.name !== product.name) {
    product.name = updates.name;
    product.slug = slugify(updates.name, { lower: true, strict: true });
  }

  Object.assign(product, {
    description: updates.description ?? product.description,
    price: updates.price ?? product.price,
    category: updates.category ?? product.category,
    stock: updates.stock ?? product.stock,
    sku: updates.sku ?? product.sku,
    barcode: updates.barcode ?? product.barcode,
    status: updates.status ?? product.status,
    metaTitle: updates.metaTitle ?? product.metaTitle,
    metaKeywords: updates.metaKeywords ?? product.metaKeywords,
  });

  // Handle selective image removal
  if (updates.imagesToRemove) {
    try {
      const imagesToRemove = JSON.parse(updates.imagesToRemove);
      if (Array.isArray(imagesToRemove) && imagesToRemove.length > 0) {
        product.images = product.images.filter(img => !imagesToRemove.includes(img));
      }
    } catch (e) {
      // Invalid JSON, ignore
    }
  }

  // Handle legacy removeImage flag (removes all images)
  if (updates.removeImage === "true") {
    product.images = [];
  }

  // Handle new images - add to existing
  if (newImages.length) {
    product.images.push(...newImages);
  }

  // Update primary image
  product.primaryImage = product.images[0] || null;

  await product.save();
  return product.populate("category", "name slug parent");
}

export async function deleteProductService(id) {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error("Product not found");
}

export async function reduceStockService(id, quantity) {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");
  if (product.stock < quantity) throw new Error("Insufficient stock");

  product.stock -= quantity;
  await product.save();

  return {
    stock: product.stock,
    lowStock: isLowStock(product.stock),
  };
}

export async function getLowStockProductsService() {
  return Product.find({
    stock: { $lte: LOW_STOCK_THRESHOLD },
    status: "active",
  }).populate("category", "name slug");
}

export async function getOutOfStockProductsService() {
  return Product.find({
    stock: 0,
    status: "active",
  }).populate("category", "name slug");
}

export async function getRelatedProductsByIdService(id) {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  return Product.find({
    _id: { $ne: product._id },
    category: product.category,
    status: "active",
  })
    .limit(4)
    .populate("category", "name slug");
}

export async function getRelatedProductsBySlugService(slug) {
  const product = await Product.findOne({ slug, status: "active" });
  if (!product) throw new Error("Product not found");

  return Product.find({
    _id: { $ne: product._id },
    category: product.category,
    status: "active",
  })
    .limit(4)
    .populate("category", "name slug");
}

export async function getProductsByParentCategoryService(slug) {
  const parent = await Category.findOne({ slug });
  if (!parent) return [];

  const children = await Category.find({ parent: parent._id }).select("_id");

  const ids = [parent._id, ...children.map(c => c._id)];

  return Product.find({
    category: { $in: ids },
    status: "active",
  }).populate("category", "name slug parent");
}
