import cloudinary from "../config/cloudinary.js";
import {
  getPublicProductsService,
  getProductBySlugService,
  getAdminProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
  reduceStockService,
  getLowStockProductsService,
  getOutOfStockProductsService,
  getRelatedProductsByIdService,
  getRelatedProductsBySlugService,
  getProductsByParentCategoryService,
} from "../services/productService.js";

/* ================= PUBLIC ================= */

export async function getProductsPublic(req, res) {
  try {
    const products = await getPublicProductsService(req.query);
    res.json({ products });
  } catch {
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

export async function getProductBySlug(req, res) {
  try {
    const product = await getProductBySlugService(req.params.slug);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ product });
  } catch {
    res.status(500).json({ error: "Failed to fetch product" });
  }
}

export async function getProductsByParentCategory(req, res) {
  try {
    const products = await getProductsByParentCategoryService(req.params.slug);
    res.json({ products });
  } catch {
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

/* ================= ADMIN ================= */

export async function getProductsAdmin(req, res) {
  const products = await getAdminProductsService();
  res.json({ products });
}

export async function createProduct(req, res) {
  try {
    const images = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "products" }
        );
        images.push(result.secure_url);
      }
    }

    const product = await createProductService({
      ...req.body,
      images,
      metaKeywords: req.body.metaKeywords
        ? req.body.metaKeywords.split(",").map(k => k.trim())
        : [],
    });

    res.status(201).json({ product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// export async function updateProduct(req, res) {
//   try {
//     const images = [];

//     if (req.files?.length) {
//       for (const file of req.files) {
//         const result = await cloudinary.uploader.upload(
//           `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
//           { folder: "products" }
//         );
//         images.push(result.secure_url);
//       }
//     }

//     const product = await updateProductService(
//       req.params.id,
//       req.body,
//       images
//     );

//     res.json({ product });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// }

export async function updateProduct(req, res) {
  try {
    const images = [];

    /* ---------------- REMOVE EXISTING IMAGE ---------------- */
    // coming from frontend as string "true"
    if (req.body.removeImage === "true") {
      req.body.primaryImage = null;
      req.body.images = [];
    }

    /* ---------------- UPLOAD NEW IMAGES ---------------- */
    if (req.files?.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "products" }
        );
        images.push(result.secure_url);
      }
    }

    const product = await updateProductService(
      req.params.id,
      req.body,
      images
    );

    res.json({ product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    await deleteProductService(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export async function reduceProductStock(req, res) {
  try {
    const result = await reduceStockService(
      req.params.id,
      Number(req.body.quantity)
    );

    res.json({
      message: "Stock reduced",
      ...result,
      warning: result.lowStock ? "⚠️ Low stock alert" : null,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getLowStockProducts(req, res) {
  const products = await getLowStockProductsService();
  res.json({ count: products.length, products });
}

export async function getOutOfStockProducts(req, res) {
  const products = await getOutOfStockProductsService();
  res.json({ count: products.length, products });
}

export async function getRelatedProducts(req, res) {
  try {
    const products = await getRelatedProductsByIdService(req.params.id);
    res.json({ products });
  } catch {
    res.status(404).json({ error: "Product not found" });
  }
}

export async function getRelatedProductsBySlug(req, res) {
  try {
    const products = await getRelatedProductsBySlugService(req.params.slug);
    res.json({ products });
  } catch {
    res.status(404).json({ error: "Product not found" });
  }
}








