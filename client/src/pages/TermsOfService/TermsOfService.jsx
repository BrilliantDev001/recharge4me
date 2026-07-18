import LegalPageLayout from "../../components/layout/LegalPageLayout/LegalPageLayout.jsx";

function TermsOfService() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="July 2026">
      <div className="legal-page__body">
        <p>
          These Terms govern your use of Recharge4Me. By creating an account,
          you agree to them.
        </p>

        <h2>What Recharge4Me Does</h2>
        <p>
          Recharge4Me gives you a public link that others can use to send you
          mobile airtime or data. When a sponsor pays through your link, we
          collect the payment via our payment processor, Paystack, and deliver
          the airtime/data to your registered phone number via our delivery
          partner, VTpass.
        </p>

        <h2>Account Responsibilities</h2>
        <ul>
          <li>
            You must provide accurate account information, including a phone
            number you actually control — airtime is delivered directly to it.
          </li>
          <li>
            You're responsible for keeping your password secure and for all
            activity under your account.
          </li>
          <li>
            You must verify your email address before your public link becomes
            fully active.
          </li>
        </ul>

        <h2>Payments and Delivery</h2>
        <ul>
          <li>
            All payments are processed by Paystack. We do not store sponsor card
            details.
          </li>
          <li>
            Once a payment is verified as successful, we attempt delivery of
            airtime/data automatically.
          </li>
          <li>
            In the rare case a payment succeeds but delivery fails on our
            delivery partner's end, we will resolve it manually. This is
            reflected honestly in your transaction history rather than shown as
            a false success.
          </li>
          <li>
            Recharges are typically irreversible once delivered, since
            airtime/data cannot be "returned" once it reaches a phone line.
          </li>
        </ul>

        <h2>Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>
            Use Recharge4Me for fraudulent transactions or to receive funds
            obtained illegally
          </li>
          <li>
            Attempt to interfere with, reverse-engineer, or abuse the platform's
            payment or delivery systems
          </li>
          <li>
            Impersonate another person when creating an account or sending a
            recharge
          </li>
        </ul>

        <h2>Sponsors (Non-Registered Users)</h2>
        <p>
          Anyone can send a recharge through a public link without creating an
          account. By doing so, sponsors agree that the payment is voluntary
          and, once successfully delivered, non-refundable.
        </p>

        <h2>Service Availability</h2>
        <p>
          We aim to keep Recharge4Me available and functioning correctly, but as
          with any service that depends on third-party payment and telecom
          providers, occasional delays or outages on their end are outside our
          direct control.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may update these Terms as the platform evolves. Continued use of
          Recharge4Me after changes are posted means you accept the updated
          Terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these Terms? Visit our{" "}
          <a href="/support">Support page</a>.
        </p>
      </div>
    </LegalPageLayout>
  );
}

export default TermsOfService;
