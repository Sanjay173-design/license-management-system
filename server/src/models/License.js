const mongoose = require("mongoose");

const LicenseSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  product: { type: String, required: true },

  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  activateInfo: {
    activatedAt: Date,
    activatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    meta: {},
  },
  expiresAt: { type: Date },
  status: {
    type: String,
    enum: ["created", "assigned", "active", "expired"],
    default: "created",
  },

  validFrom: Date,
  validTill: Date,

  createdAt: { type: Date, default: Date.now },
});

// helper
LicenseSchema.methods.isExpired = function () {
  if (!this.validTill) return false;
  return new Date() > new Date(this.validTill);
};

module.exports = mongoose.model("License", LicenseSchema);
