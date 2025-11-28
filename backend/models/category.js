import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

// Ensure (name + parent) combination is unique
categorySchema.index({ name: 1, parent: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);
