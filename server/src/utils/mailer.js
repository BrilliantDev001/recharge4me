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

module.exports = { sendVerificationEmail };
