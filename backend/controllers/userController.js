// import User from "../models/User.js";

// export async function getUsers(req, res) {
//   const users = await User.find().select("-password");
//   res.json(users);
// }

// export async function deleteUser(req, res) {
//   await User.findByIdAndDelete(req.params.id);
//   res.json({ message: "User deleted" });
// }

import User from "../models/User.js";

export async function getUsers(req, res) {
  const users = await User.find().select("-password");
  res.json(users);
}

export async function deleteUser(req, res) {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
}

// ✅ ADD THIS
export async function updateUser(req, res) {
  const { role, username, email } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Allow updating only safe fields
  if (role) user.role = role;
  if (username) user.username = username;
  if (email) user.email = email;

  await user.save();

  res.json({
    message: "User updated successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}

