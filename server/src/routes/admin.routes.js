const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const requireRole = require("../middleware/role");

const { getAdminStats } = require("../controllers/admin.controller");

router.get("/stats", auth, requireRole("admin"), getAdminStats);

module.exports = router;
