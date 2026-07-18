import { useState } from "react";
import LegalPageLayout from "../../components/layout/LegalPageLayout/LegalPageLayout.jsx";
import { submitSupportRequest } from "../../api/client.js";
import "./Support.css";

function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // 'idle' | 'sending' | 'sent' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitSupportRequest(formData);
      setStatus("sent");
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("error");
    }
  };

  return (
    <LegalPageLayout title="Support Center">
      <div className="legal-page__body">
        <p>
          Have a question, ran into an issue with a recharge, or something not
          working as expected? Send us a message below and we'll get back to you
          by email.
        </p>

        {status === "sent" ? (
          <div className="support-success">
            <p>
              ✓ Your message has been sent. We'll reply to {formData.email}{" "}
              soon.
            </p>
          </div>
        ) : (
          <form className="support-form" onSubmit={handleSubmit}>
            {status === "error" && (
              <p className="support-form__error">{errorMessage}</p>
            )}

            <label className="support-form__field">
              <span>Your Name</span>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange("name")}
                required
              />
            </label>

            <label className="support-form__field">
              <span>Your Email</span>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                required
              />
            </label>

            <label className="support-form__field">
              <span>Subject</span>
              <input
                type="text"
                value={formData.subject}
                onChange={handleChange("subject")}
                required
              />
            </label>

            <label className="support-form__field">
              <span>Message</span>
              <textarea
                rows={5}
                value={formData.message}
                onChange={handleChange("message")}
                required
              />
            </label>

            <button
              type="submit"
              className="support-form__submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </LegalPageLayout>
  );
}

export default Support;
