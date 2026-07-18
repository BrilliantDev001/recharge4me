const { sendSupportRequestEmail } = require("../../utils/mailer");

const submitSupportRequest = async ({ name, email, subject, message }) => {
  if (!name || !email || !subject || !message) {
    throw new Error("All fields are required.");
  }

  const sent = await sendSupportRequestEmail({ name, email, subject, message });

  if (!sent) {
    throw new Error(
      "We couldn't send your message right now. Please try again shortly.",
    );
  }

  return {
    message: "Your message has been sent — we'll get back to you soon.",
  };
};

module.exports = submitSupportRequest;
