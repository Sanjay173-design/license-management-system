const cron = require("node-cron");
const License = require("../models/License");
const { sendExpiryReminderEmail } = require("../Config/emailService");
const LicenseLog = require("../models/LicenseLog");

const startCronJobs = () => {
  console.log("⏱️ Cron Jobs started...");

  // Run every day at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("🔄 Running daily license expiration check...");

    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    try {
      await License.updateMany(
        { status: "active", validTill: { $lte: now } },
        { status: "expired" }
      );

      // 2️⃣ Find licenses expiring in 7 days
      const expiringSoon = await License.find({
        status: "active",
        validTill: { $gte: now, $lte: sevenDaysLater },
      }).populate("assignedTo");

      for (const lic of expiringSoon) {
        await sendExpiryReminderEmail({
          email: lic.assignedTo.email,
          product: lic.product,
          expires: lic.validTill,
        });

        console.log("📧 Reminder sent to", lic.assignedTo.email);
      }

      await LicenseLog.create({
        licenseId: lic._id,
        userId: lic.assignedTo,
        action: "expired",
        message: "License expired automatically",
      });

      console.log("✔️ Expiry reminders processed");

      console.log("✔️ Expired licenses updated");
    } catch (error) {
      console.error("Cron job error:", error.message);
    }
  });
};

module.exports = { startCronJobs };
