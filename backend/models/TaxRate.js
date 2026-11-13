import mongoose from "mongoose";

const taxRateSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      unique: true,
    },
    rate: {
      type: Number, // percentage
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TaxRate", taxRateSchema);