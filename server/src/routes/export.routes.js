const express = require("express");
const router = express.Router();

const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

const License = require("../models/License");
const User = require("../models/User");
const LicenseLog = require("../models/LicenseLog");

const auth = require("../middleware/auth");
const requireRole = require("../middleware/role");

// =======================
//  CSV EXPORT (LICENSES)
// =======================
router.get("/licenses/csv", auth, requireRole("admin"), async (req, res) => {
  const licenses = await License.find().populate("assignedTo", "email");

  const fields = [
    "key",
    "product",
    "status",
    "validFrom",
    "validTill",
    "assignedTo.email",
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(licenses);

  res.header("Content-Type", "text/csv");
  res.attachment("licenses_report.csv");
  return res.send(csv);
});

// =======================
//  XLSX EXPORT (LICENSES)
// =======================
router.get("/licenses/xlsx", auth, requireRole("admin"), async (req, res) => {
  const licenses = await License.find().populate("assignedTo", "email");

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Licenses");

  sheet.columns = [
    { header: "Key", key: "key" },
    { header: "Product", key: "product" },
    { header: "Status", key: "status" },
    { header: "Valid From", key: "validFrom" },
    { header: "Valid Till", key: "validTill" },
    { header: "Assigned To", key: "assignedTo" },
  ];

  licenses.forEach((l) =>
    sheet.addRow({
      key: l.key,
      product: l.product,
      status: l.status,
      validFrom: l.validFrom,
      validTill: l.validTill,
      assignedTo: l.assignedTo?.email || "-",
    })
  );

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=licenses.xlsx");

  await workbook.xlsx.write(res);
  res.end();
});

// =======================
//  PDF EXPORT (LICENSES)
// =======================
router.get("/licenses/pdf", auth, requireRole("admin"), async (req, res) => {
  const licenses = await License.find().populate("assignedTo", "email");

  const doc = new PDFDocument({ margin: 30 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=licenses.pdf");

  doc.pipe(res);

  doc.fontSize(18).text("License Report", { underline: true });
  doc.moveDown();

  licenses.forEach((l) => {
    doc.fontSize(12).text(`Product: ${l.product}`);
    doc.text(`Key: ${l.key}`);
    doc.text(`Status: ${l.status}`);
    doc.text(`Assigned To: ${l.assignedTo?.email || "-"}`);
    doc.text(`Valid Till: ${l.validTill}`);
    doc.moveDown();
  });

  doc.end();
});

module.exports = router;
