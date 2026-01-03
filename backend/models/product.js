import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // BASIC INFO
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // CATEGORY (from Day 3)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // PRICING
    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      default: null,
    },

    // INVENTORY
    stock: {
      type: Number,
      default: 0,
    },

    sku: {
      type: String,
      default: "",
    },

    barcode: {
      type: String,
      default: "",
    },

    // IMAGES
    images: {
      type: [String], // multiple images
      default: [],
    },

    primaryImage: {
      type: String,
      default: "",
    },

    // STATUS
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // SEO
    metaTitle: {
      type: String,
      default: "",
    },

    metaKeywords: {
      type: [String],
      default: [],
    },

    // REVIEW STATS (AUTO UPDATED LATER)
    ratingAverage: {
      type: Number,
      default: 0,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
