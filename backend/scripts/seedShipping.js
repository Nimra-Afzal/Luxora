import mongoose from "mongoose";
import dotenv from "dotenv";
import ShippingZone from "../models/ShippingZone.js";
import ShippingMethod from "../models/ShippingMethod.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const zone = await ShippingZone.create({
  name: "Pakistan Zone",
  countries: ["Pakistan"],
});

await ShippingMethod.create({
  zone: zone._id,
  name: "Standard Shipping",
  price: 300,
  freeShippingThreshold: 5000,
  estimatedDays: "3-5 days",
});

console.log("Shipping seeded successfully ✅");
process.exit();