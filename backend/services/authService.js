import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function findUserByEmail(email) {
  return User.findOne({ email });
}

export async function createUser({ username, email, password, role = "user" }) {
  const user = new User({ username, email, password, role }); // ✅ include role
  await user.save();
  return user;
}

export async function validatePassword(user, plainPassword) {
  return user.comparePassword(plainPassword);
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role, // ✅ add role to token
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}
