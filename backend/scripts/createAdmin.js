import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get correct path for .env (backend root)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import User from "../models/User.js";

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@promptopia.local";
    const exists = await User.findOne({ email });

    if (exists) {
      console.log("⚠️ Admin already exists:", exists.email);
      process.exit(0);
    }

    const admin = new User({
      username: "Admin",
      email,
      password: "Admin123!", // default password
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user created:", admin.email, "password: Admin123!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

run();
