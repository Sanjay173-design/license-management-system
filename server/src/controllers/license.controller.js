const License = require("../models/License");
const User = require("../models/User");
const LicenseLog = require("../models/LicenseLog");
const {
  sendLicenseEmail,
  sendActivatedEmail,
} = require("../Config/emailService.js");

// Generate key
function generateKey() {
  return "LIC-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Create License (Admin)
exports.createLicense = async (req, res) => {
  try {
    const { product, validDays } = req.body;

    if (!product) return res.status(400).json({ error: "Product is required" });

    if (!validDays)
      return res.status(400).json({ error: "validDays is required" });

    // Auto-generate key
    const key =
      "LIC-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    const validFrom = new Date();
    const validTill = new Date();
    validTill.setDate(validFrom.getDate() + validDays);

    const license = await License.create({
      key,
      product,
      issuedBy: req.user.id, // from JWT
      validFrom,
      validTill,
      status: "created",
    });

    await LicenseLog.create({
      licenseId: license._id,
      userId: req.user.id,
      action: "created",
      message: `License created for ${license.product}`,
    });

    res.json({ message: "License created", license });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Assign License (Admin)
exports.assignLicense = async (req, res) => {
  try {
    const { licenseId, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const license = await License.findById(licenseId);
    if (!license) return res.status(404).json({ error: "License not found" });

    if (license.status !== "created")
      return res
        .status(400)
        .json({ error: "License already assigned or active" });

    license.assignedTo = userId;
    license.status = "assigned";
    await license.save();

    await LicenseLog.create({
      licenseId: license._id,
      userId: userId,
      action: "assigned",
      message: `License assigned to ${user.email}`,
    });

    // 👉 send email after success
    await sendLicenseEmail({
      email: user.email,
      product: license.product,
      key: license.key,
      expires: license.validTill,
    });

    res.json({ success: true, license });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Activate License (User)
exports.activateLicense = async (req, res) => {
  try {
    const { licenseId } = req.body;

    const license = await License.findById(licenseId);
    if (!license) return res.status(404).json({ error: "License not found" });

    if (!license.assignedTo || license.assignedTo.toString() !== req.user.id)
      return res.status(403).json({ error: "Not your license" });

    if (license.status !== "assigned")
      return res
        .status(400)
        .json({ error: "License must be assigned before activation" });

    license.status = "active";
    license.activateInfo = {
      activatedAt: new Date(),
      activatedBy: req.user.id,
      meta: req.body.meta || {},
    };

    await license.save();

    await LicenseLog.create({
      licenseId: license._id,
      userId: req.user.id,
      action: "activated",
      message: `License activated by user`,
    });

    const user = await User.findById(req.user.id);

    await sendActivatedEmail({
      email: user.email,
      product: license.product,
      key: license.key,
      expires: license.validTill,
    });

    res.json({ success: true, license });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all licenses (ADMIN ONLY)
exports.allLicenses = async (req, res) => {
  try {
    const licenses = await License.find().populate("assignedTo", "name email");
    res.json({ success: true, licenses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get licenses assigned to logged-in USER
exports.myLicenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const licenses = await License.find({ assignedTo: userId });

    res.json({ success: true, licenses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.userDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const licenses = await License.find({ assignedTo: userId });

    const stats = {
      total: licenses.length,
      active: licenses.filter((l) => l.status === "active").length,
      expired: licenses.filter((l) => l.status === "expired").length,
      assignedNotActivated: licenses.filter((l) => l.status === "assigned")
        .length,
    };

    // Last 5 licenses
    const recent = licenses
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5);

    res.json({ stats, recent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.renewLicense = async (req, res) => {
  try {
    const { id } = req.params;
    const { extendDays } = req.body; // number of days to extend

    if (!extendDays || extendDays <= 0)
      return res.status(400).json({ message: "extendDays is required" });

    const license = await License.findById(id).populate("assignedTo");

    if (!license) return res.status(404).json({ message: "License not found" });

    // Extend expiry
    const newExpiry = new Date(license.validTill);
    newExpiry.setDate(newExpiry.getDate() + extendDays);

    license.validTill = newExpiry;
    license.status = "active"; // in case it was expired
    await license.save();

    await LicenseLog.create({
      licenseId: license._id,
      userId: req.user.id,
      action: "renewed",
      message: "License renewed",
    });

    // Send renewal email
    await sendRenewalEmail({
      email: license.assignedTo.email,
      product: license.product,
      key: license.key,
      newExpiry: newExpiry,
    });

    return res.json({
      message: "License renewed successfully",
      license,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Renewal failed", error: err.message });
  }
};
