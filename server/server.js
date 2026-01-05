require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { startCronJobs } = require("./src/utils/cronJobs");

const app = express();
app.use(cors());
app.use(express.json());
startCronJobs();

// routes
const authRoutes = require("./src/routes/auth.routes"); // implement simple register/login
const licenseRoutes = require("./src/routes/license.routes");
const logsRoutes = require("./src/routes/logs.routes");

app.use("/api/auth", authRoutes);
app.use("/api/licenses", licenseRoutes);
app.use("/api/admin", require("./src/routes/admin.routes"));
app.use("/api/logs", require("./src/routes/logs.routes"));
app.use("/api/export", require("./src/routes/export.routes"));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const { startCronJobs } = require("./src/utils/cronJobs");
    startCronJobs();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
