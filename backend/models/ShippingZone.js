import mongoose from "mongoose";

const shippingZoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    countries: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ShippingZone", shippingZoneSchema);