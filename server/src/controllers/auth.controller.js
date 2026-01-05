const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// ==========================
// Register User
// ==========================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!password || password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || "user",
    });

    return res.json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Registration error",
      error: err.message,
    });
  }
};

// ==========================
// Login
// ==========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "Wrong credentials" });

    if (user.status === "DISABLED") {
      return res
        .status(403)
        .json({ message: "Account disabled. Contact admin." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // SEND USER INFO ALSO
    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
};

// ==========================
// Get My Profile
// ==========================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "_id name email role createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

// ==========================
// Update Password
// ==========================
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // compare with stored hash
    const match = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!match)
      return res.status(400).json({ message: "Old password incorrect" });

    // save new password
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Password update error",
      error: err.message,
    });
  }
};

// ==========================
// Admin: Get All Users
// ==========================
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  return res.json(users);
};

// ==========================
// Admin: PUT/auth/role
// ==========================
exports.changeUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Role updated", user });
  } catch (err) {
    res.status(500).json({ message: "Role update failed", error: err.message });
  }
};

// ==========================
// Admin: toggleUserStatus
// ==========================
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    await user.save();

    res.json({
      message: `User ${user.status === "ACTIVE" ? "enabled" : "disabled"}`,
      user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Status toggle failed", error: err.message });
  }
};
