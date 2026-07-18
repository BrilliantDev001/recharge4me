import LegalPageLayout from "../../components/layout/LegalPageLayout/LegalPageLayout.jsx";

function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="July 2026">
      <div className="legal-page__body">
        <p>
          Recharge4Me ("we," "us," or "our") lets people create a public link
          that others ("sponsors") can use to send them airtime or mobile data.
          This policy explains what information we collect to make that work,
          and how we handle it.
        </p>

        <h2>Information We Collect</h2>
        <p>When you create a Recharge4Me account, we collect:</p>
        <ul>
          <li>Your name, email address, and phone number</li>
          <li>
            A password, which we store only as a securely hashed value — never
            in plain text
          </li>
          <li>
            An optional profile message and profile photo, if you choose to add
            one
          </li>
        </ul>
        <p>
          When a sponsor uses your public recharge link, we collect the recharge
          amount, network, and, if they choose to share it, their name and a
          short message — we do not require sponsors to create an account.
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>
            To create and secure your account, including verifying your email
            address
          </li>
          <li>To process payments through our payment processor, Paystack</li>
          <li>
            To deliver airtime/data to your phone number through our delivery
            partner, VTpass
          </li>
          <li>
            To send you transactional notifications (e.g. "you've received a
            recharge") by email, based on your notification preferences in
            Settings
          </li>
        </ul>

        <h2>Who We Share Information With</h2>
        <p>
          We share only what's necessary for a transaction to work: your phone
          number and the recharge amount are sent to VTpass to deliver
          airtime/data, and payment details are handled directly by Paystack —
          we never see or store your sponsors' card details.
        </p>

        <h2>Data Retention</h2>
        <p>
          We keep your account and transaction history for as long as your
          account remains active, so you can view your recharge history in your
          dashboard. You can request account deletion at any time by contacting
          us through our <a href="/support">Support page</a>.
        </p>

        <h2>Cookies</h2>
        <p>
          We use your browser's local storage to keep you signed in between
          visits. We don't use third-party advertising or tracking cookies.
        </p>

        <h2>Security</h2>
        <p>
          Passwords are hashed, not stored in plain text. Payment card details
          are never handled or stored by us directly — they go straight to
          Paystack, a licensed payment processor. Verification links and
          password-reset tokens expire automatically and are stored only in
          hashed form.
        </p>

        <h2>Your Choices</h2>
        <p>
          You can update your profile information and notification preferences
          anytime from Settings. If you'd like your account and associated data
          removed entirely, reach out via our{" "}
          <a href="/support">Support page</a>.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Visit our{" "}
          <a href="/support">Support page</a>.
        </p>
      </div>
    </LegalPageLayout>
  );
}

export default PrivacyPolicy;
