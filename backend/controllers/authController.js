import { createUser, findUserByEmail, validatePassword, generateToken } from "../services/authService.js";

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: "All fields are required" });
    const exists = await findUserByEmail(email);
    if (exists) return res.status(409).json({ error: "Email already in use" });

    const user = await createUser({ username, email, password });
    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username, email: user.email, role: user.role || "user" }
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await validatePassword(user, password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user);
    return res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role || "user" }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
