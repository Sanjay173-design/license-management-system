const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET,
  },
});

async function sendLicenseEmail({ email, product, key, expires }) {
  try {
    const htmlTemplate = `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f4f7;padding:20px;">
  
    <table width="100%" style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="background:#2563eb;color:#ffffff;padding:16px 20px;font-size:18px;font-weight:bold;">
          License Management System
        </td>
      </tr>

      <tr>
        <td style="padding:20px;">
          <h2 style="margin:0 0 10px 0;color:#111827;"> License Assigned Successfully</h2>
          <p style="margin:0 0 14px;color:#374151;">
            Hello, your software license has been assigned. You can now log in and activate it from your dashboard.
          </p>

          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:14px;margin-bottom:14px;">
            <p><b>🧾 Product:</b> ${product}</p>
            <p><b>🔑 License Key:</b> ${key}</p>
            <p><b>📅 Expiry Date:</b> ${new Date(expires).toDateString()}</p>
          </div>

          <a href="http://localhost:5173/login"
            style="display:inline-block;background:#2563eb;color:#ffffff;
            padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;">
            🔓 Login & Activate License
          </a>

          <p style="margin-top:16px;color:#6b7280;font-size:13px;">
            If you did not request this license, please contact support immediately.
          </p>
        </td>
      </tr>

      <tr>
        <td style="background:#f3f4f6;padding:12px;text-align:center;color:#6b7280;font-size:12px;">
          © ${new Date().getFullYear()} License Management System — All rights reserved.
        </td>
      </tr>
    </table>
  </div>
`;
    const params = {
      Source: process.env.FROM_EMAIL,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: "License Assigned " },
        Body: {
          Html: {
            Data: htmlTemplate,
          },
        },
      },
    };

    await ses.send(new SendEmailCommand(params));
    console.log("📧 Email sent to", email);
  } catch (err) {
    console.error("❌ SES Email Error:", err);
  }
}

const activatedTemplate = ({ product, key, expires }) => `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f4f4f7;padding:20px;">
  <table width="100%" style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden;">
    
    <tr>
      <td style="background:#16a34a;color:#ffffff;padding:16px 20px;font-size:18px;font-weight:bold;">
        License Management System
      </td>
    </tr>

    <tr>
      <td style="padding:20px;">
        <h2 style="margin:0 0 10px 0;color:#111827;">License Activated Successfully</h2>
        <p style="color:#374151;margin-bottom:14px;">
          Your license has been activated and is now ready for use.
        </p>

        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:14px;margin-bottom:14px;">
          <p><b>🧾 Product:</b> ${product}</p>
          <p><b>🔑 License Key:</b> ${key}</p>
          <p><b>📅 Valid Until:</b> ${new Date(expires).toDateString()}</p>
        </div>

        <a href="http://localhost:5173/login"
          style="display:inline-block;background:#16a34a;color:#ffffff;
          padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;">
          🚀 Go to Dashboard
        </a>

        <p style="margin-top:16px;color:#6b7280;font-size:13px;">
          If you did not activate this license, please contact support immediately.
        </p>
      </td>
    </tr>

    <tr>
      <td style="background:#f3f4f6;padding:12px;text-align:center;color:#6b7280;font-size:12px;">
        © ${new Date().getFullYear()} License Management System — All rights reserved.
      </td>
    </tr>

  </table>
</div>`;

async function sendActivatedEmail(data) {
  await ses.send(
    new SendEmailCommand({
      Source: process.env.FROM_EMAIL,
      Destination: { ToAddresses: [data.email] },
      Message: {
        Subject: { Data: "License Activated" },
        Body: { Html: { Data: activatedTemplate(data) } },
      },
    })
  );
}

const expiryReminderTemplate = ({ product, expires }) => `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f4f4f7;padding:20px;">
  <table width="100%" style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden;">
    
    <tr>
      <td style="background:#ca8a04;color:#ffffff;padding:16px 20px;font-size:18px;font-weight:bold;">
        License Management System
      </td>
    </tr>

    <tr>
      <td style="padding:20px;">
        <h2 style="margin:0 0 10px 0;color:#111827;">License Expiry Reminder ⏳</h2>
        <p style="color:#374151;margin-bottom:14px;">
          Your license will expire soon. Please renew to avoid service interruption.
        </p>

        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:14px;margin-bottom:14px;">
          <p><b>🧾 Product:</b> ${product}</p>
          <p><b>📅 Expiry Date:</b> ${new Date(expires).toDateString()}</p>
        </div>

        <a href="http://localhost:5173/login"
          style="display:inline-block;background:#ca8a04;color:#ffffff;
          padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;">
          🔁 Renew / Manage License
        </a>

        <p style="margin-top:16px;color:#6b7280;font-size:13px;">
          If you have already renewed, please ignore this message.
        </p>
      </td>
    </tr>

    <tr>
      <td style="background:#f3f4f6;padding:12px;text-align:center;color:#6b7280;font-size:12px;">
        © ${new Date().getFullYear()} License Management System — All rights reserved.
      </td>
    </tr>

  </table>
</div>`;

async function sendExpiryReminderEmail(data) {
  await ses.send(
    new SendEmailCommand({
      Source: process.env.FROM_EMAIL,
      Destination: { ToAddresses: [data.email] },
      Message: {
        Subject: { Data: "License Expiring Soon ⏳" },
        Body: { Html: { Data: expiryReminderTemplate(data) } },
      },
    })
  );
}

const renewalTemplate = ({ product, key, newExpiry }) => `
  <div style="font-family:Arial;padding:20px">
    <h2 style="color:#2563eb">License Renewed 🔁</h2>

    <p>Your license has been successfully renewed.</p>

    <p><b>Product:</b> ${product}</p>
    <p><b>License Key:</b> ${key}</p>
    <p><b>New Expiry:</b> ${new Date(newExpiry).toDateString()}</p>

    <p>Thank you for staying with us.</p>
  </div>
`;

async function sendRenewalEmail({ email, product, key, newExpiry }) {
  await ses.send(
    new SendEmailCommand({
      Source: process.env.FROM_EMAIL,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: "Your License Has Been Renewed 🔁" },
        Body: {
          Html: { Data: renewalTemplate({ product, key, newExpiry }) },
        },
      },
    })
  );
}

module.exports = {
  sendLicenseEmail,
  sendActivatedEmail,
  sendExpiryReminderEmail,
  sendRenewalEmail,
};
