const User = require("../models/User");
const License = require("../models/License");

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLicenses = await License.countDocuments();

    const activeLicenses = await License.countDocuments({
      status: "active",
    });

    const expiredLicenses = await License.countDocuments({
      status: "expired",
    });

    res.json({
      totalUsers,
      totalLicenses,
      activeLicenses,
      expiredLicenses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
