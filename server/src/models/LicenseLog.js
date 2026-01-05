const mongoose = require("mongoose");

const LicenseLogSchema = new mongoose.Schema({
  licenseId: { type: mongoose.Schema.Types.ObjectId, ref: "License" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String, // created | assigned | activated | expired | renewed
  message: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LicenseLog", LicenseLogSchema);
