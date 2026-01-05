const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const requireRole = require("../middleware/role"); //

const {
  createLicense,
  assignLicense,
  activateLicense,
  allLicenses,
  myLicenses,
  userDashboardStats,
  renewLicense,
} = require("../controllers/license.controller");

// Admin only
router.post("/create", authMiddleware, requireRole("admin"), createLicense);
router.post("/assign", authMiddleware, requireRole("admin"), assignLicense);
router.get("/all", authMiddleware, requireRole("admin"), allLicenses);
router.put("/renew/:id", authMiddleware, requireRole("admin"), renewLicense);

// User
router.post("/activate", authMiddleware, activateLicense);
router.get("/my", authMiddleware, myLicenses);
router.get("/dashboard/stats", authMiddleware, userDashboardStats);

module.exports = router;
