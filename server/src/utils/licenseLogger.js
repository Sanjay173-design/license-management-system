const LicenseLog = require("../models/LicenseLog");

async function logLicenseEvent({ licenseId, userId, action, message }) {
  await LicenseLog.create({
    licenseId,
    userId,
    action,
    message,
  });
}

module.exports = logLicenseEvent;
