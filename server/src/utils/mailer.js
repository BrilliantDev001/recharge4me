const axios = require("axios");

const brevoClient = axios.create({
  baseURL: "https://api.brevo.com/v3",
  headers: {
    "api-key": process.env.BREVO_API_KEY,
    "Content-Type": "application/json",
  },
});

async function sendVerificationEmail(toEmail, name, rawToken) {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`;

  try {
    await brevoClient.post("/smtp/email", {
      sender: {
        name: process.env.BREVO_SENDER_NAME || "Recharge4Me",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: toEmail, name }],
      subject: "Verify your Recharge4Me account",
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #10b981;">Welcome to Recharge4Me, ${name}!</h2>
          <p>Please confirm your email address to activate your account and start receiving airtime.</p>
          <a href="${verifyUrl}"
             style="display:inline-block; background:#10b981; color:#fff; padding:12px 24px;
                    border-radius:8px; text-decoration:none; font-weight:bold; margin: 16px 0;">
            Verify My Email
          </a>
          <p style="color:#666; font-size:14px;">This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    // Logged, not thrown — a failed email shouldn't crash registration.
    // The user can request a resend later.
    console.error(
      "Failed to send verification email:",
      error.response?.data || error.message,
    );
  }
}

async function sendRechargeNotificationEmail(toEmail, name, { amount, network, type, status }) {
  const isSuccess = status === "success";

  const subject = isSuccess
    ? `You've received ₦${amount.toLocaleString()} in ${type.toLowerCase()}!`
    : "There was an issue delivering your recharge";

  const bodyMessage = isSuccess
    ? `Good news! Someone just sent you ₦${amount.toLocaleString()} worth of ${network} ${type.toLowerCase()} through your Recharge4Me link. It's already been delivered to your line.`
    : `A sponsor's payment of ₦${amount.toLocaleString()} for ${network} ${type.toLowerCase()} was received, but we ran into an issue delivering it automatically. Our team has been notified and will resolve this shortly.`;

  try {
    await brevoClient.post("/smtp/email", {
      sender: {
        name: process.env.BREVO_SENDER_NAME || "Recharge4Me",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: toEmail, name }],
      subject,
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: ${isSuccess ? "#10b981" : "#ef4444"};">Hi ${name},</h2>
          <p>${bodyMessage}</p>
          <p style="color:#666; font-size:14px; margin-top: 24px;">
            You can review this and all your recharges anytime in your
            <a href="${process.env.CLIENT_URL}/transactions">Recharge4Me dashboard</a>.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send recharge notification email:", error.response?.data || error.message);
  }
}

async function sendSupportRequestEmail({ name, email, subject, message }) {
  try {
    await brevoClient.post("/smtp/email", {
      sender: {
        name: process.env.BREVO_SENDER_NAME || "Recharge4Me",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: process.env.SUPPORT_INBOX_EMAIL, name: "Recharge4Me Support" }],
      replyTo: { email, name },
      subject: `[Support] ${subject}`,
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p>${message.replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send support request email:", error.response?.data || error.message);
    return false;
  }
}

module.exports = { sendVerificationEmail, sendRechargeNotificationEmail, sendSupportRequestEmail };
