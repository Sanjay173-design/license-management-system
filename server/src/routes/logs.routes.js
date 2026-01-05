const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const requireRole = require("../middleware/role");
const LicenseLog = require("../models/LicenseLog");

// GET ALL LOGS (Admin)
router.get("/all", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const logs = await LicenseLog.find()
      .populate("userId", "name email")
      .populate("licenseId", "key product")
      .sort({ createdAt: -1 });

    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

// GET LOGS BY LICENSE
router.get(
  "/license/:id",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const logs = await LicenseLog.find({ licenseId: req.params.id })
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      res.json({ success: true, logs });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch logs" });
    }
  }
);

module.exports = router;
