import Review from "../models/review.js";
import Product from "../models/product.js";

// Helper: recalculate product rating
async function updateProductRating(productId) {
  const reviews = await Review.find({ product: productId });

  const ratingCount = reviews.length;

  const ratingAverage =
    ratingCount === 0
      ? 0
      : (
          reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
        ).toFixed(1);

  await Product.findByIdAndUpdate(productId, {
    ratingCount,
    ratingAverage,
  });
}

export async function createReview(req, res) {
  try {
    const { product, rating, comment } = req.body;
    const userId = req.user.id;

    // 1️⃣ Check duplicate review
    const existingReview = await Review.findOne({
      product,
      user: userId,
    });

    if (existingReview) {
      return res.status(400).json({
        error: "You have already reviewed this product",
      });
    }

    // 2️⃣ Create review
    const review = await Review.create({
      product,
      user: userId,
      rating,
      comment,
    });

    // 3️⃣ Recalculate rating stats
    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    await Product.findByIdAndUpdate(product, {
      ratingAverage: stats[0].avgRating,
      ratingCount: stats[0].count,
    });

    res.status(201).json({ review });
  } catch (err) {
    console.error("❌ Create review error:", err);
    res.status(500).json({ error: "Failed to add review" });
  }
}

// DELETE REVIEW
export async function deleteReview(req, res) {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Only review owner or admin
    if (
      review.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await review.deleteOne();

    // Recalculate product ratings
    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    await Product.findByIdAndUpdate(review.product, {
      ratingAverage: stats.length ? stats[0].avgRating : 0,
      ratingCount: stats.length ? stats[0].count : 0,
    });

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error("❌ Delete review error:", err);
    res.status(500).json({ error: "Failed to delete review" });
  }
}
