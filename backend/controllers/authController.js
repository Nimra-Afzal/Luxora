import jwt from "jsonwebtoken"; // ✅ FIX 1: missing import

import {
  createUser,
  findUserByEmail,
  validatePassword,
  generateRefreshToken,
  generateAccessToken,
} from "../services/authService.js";
import User from "../models/User.js";

// -----------------------------------------------------
// REGISTER
// -----------------------------------------------------
export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const exists = await findUserByEmail(email);
    if (exists) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const user = await createUser({ username, email, password });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// -----------------------------------------------------
// LOGIN
// -----------------------------------------------------
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await validatePassword(user, password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // ✅ FIX 2: consistent token response
    return res.json({
      token: accessToken,      // 👈 frontend NEEDS this
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// -----------------------------------------------------
// REFRESH TOKEN
// -----------------------------------------------------
export async function refreshToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const newAccessToken = generateAccessToken(user);

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
}

// -----------------------------------------------------
// GET PROFILE (Authenticated)
// -----------------------------------------------------
export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// -----------------------------------------------------
// CHANGE PASSWORD
// -----------------------------------------------------
export async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const match = await user.comparePassword(oldPassword);
  if (!match) {
    return res.status(400).json({ error: "Old password incorrect" });
  }

  user.password = newPassword;
  await user.save();

  return res.json({ message: "Password changed successfully" });
}

// -----------------------------------------------------
// UPDATE PROFILE
// -----------------------------------------------------
export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { username, email, phone, address, avatar } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists && exists._id.toString() !== userId) {
        return res.status(409).json({
          error: "Email already in use by another account",
        });
      }
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

