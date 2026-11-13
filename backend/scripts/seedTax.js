import mongoose from "mongoose";
import dotenv from "dotenv";
import TaxRate from "../models/TaxRate.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await TaxRate.create({
  country: "Pakistan",
  rate: 5, // 5%
});

console.log("Tax seeded successfully ✅");
process.exit();