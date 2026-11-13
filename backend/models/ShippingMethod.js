import mongoose from "mongoose";

const shippingMethodSchema = new mongoose.Schema(
  {
    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingZone",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    freeShippingThreshold: {
      type: Number,
      default: 0,
    },
    estimatedDays: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ShippingMethod", shippingMethodSchema);