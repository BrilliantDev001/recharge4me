# Recharge4Me

Recharge4Me is a MERN-stack platform that gives anyone a personal, shareable link for
receiving mobile airtime and data top-ups from friends, family, or supporters — no app
download or account required on the sponsor's side.

A user signs up, verifies their email, and gets a unique public link
(`recharge4.me/u/their-username`). Anyone with that link can send them real airtime — the
payment is processed securely, and the airtime is delivered automatically to the recipient's
phone within moments.

## How It Works

1. **Create an account** and verify your email.
2. **Share your unique link** (or its QR code) with people who want to support you.
3. A **sponsor opens the link**, picks an amount and network, and pays by card.
4. Once payment is confirmed, **airtime is purchased and delivered automatically** to your phone.
5. You get an **in-app notification and email**, and can track every recharge in your
   Transactions history.

## Features

- **Authentication** — registration, login, and email verification (with resend support)
- **Real payments** — card payments processed via [Paystack](https://paystack.com)
- **Real airtime delivery** — automatic purchase and delivery via [VTpass](https://vtpass.com)
  once a payment is verified (MTN, Airtel, Glo, 9mobile)
- **Personal recharge link** — a public page sponsors can use with no account of their own
- **QR codes** — each user's link is also available as a downloadable, scannable QR code
- **Dashboard** — real-time stats: total value received, recent recharges, weekly trends
- **Recharge Link management** — toggle whether your link is active, whether it accepts data
  bundles, whether sponsors can stay anonymous, and more
- **Transaction history** — full searchable/filterable log of every recharge received
- **Notifications** — in-app notification center plus email alerts when a recharge succeeds
  or if delivery runs into an issue
- **Settings** — update profile info and notification preferences
- **Support** — a real contact form that emails the team directly

## Tech Stack

**Frontend:** React (Vite), React Router, Recharts
**Backend:** Node.js, Express, MongoDB (Mongoose)
**Auth:** JSON Web Tokens (JWT), bcrypt password hashing
**Payments:** Paystack (checkout + webhook verification)
**Airtime Delivery:** VTpass API
**Transactional Email:** Brevo (verification emails, recharge notifications, support requests)
**Hosting:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Project Structure

```
recharge4me/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── api/            # Backend API client
│       ├── components/     # Shared + layout components
│       ├── context/         # Auth context/provider
│       ├── pages/           # Route-level pages
│       └── routes/          # Route guards
└── server/                 # Express backend
    └── src/
        ├── config/          # Database connection
        ├── controllers/     # Route handlers
        ├── middleware/       # Auth middleware
        ├── models/           # Mongoose schemas (User, Transaction, RechargeLink, Notification)
        ├── routes/           # Express routers
        ├── services/         # Business logic
        └── utils/            # Paystack, VTpass, mailer, token helpers
```

## Getting Started

### Prerequisites

- Node.js
- A MongoDB Atlas connection string
- API credentials for: [Paystack](https://paystack.com), [VTpass](https://vtpass.com),
  and [Brevo](https://brevo.com)

### 1. Clone and install

```bash
git clone https://github.com/BrilliantDev001/recharge4me.git
cd recharge4me

cd server && npm install
cd ../client && npm install
```

### 2. Environment variables

Create `server/.env`:

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email
BREVO_SENDER_NAME=Recharge4Me
SUPPORT_INBOX_EMAIL=your_real_email_for_support_messages

PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxx

VTPASS_BASE_URL=https://sandbox.vtpass.com/api
VTPASS_EMAIL=your_vtpass_sandbox_email
VTPASS_PASSWORD=your_vtpass_sandbox_password
```

Create `client/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run locally

```bash
# In server/
npm run dev

# In client/
npm run dev
```

The app will be available at `http://localhost:5173`.

## Deployment

- **Frontend** is deployed on Vercel (root directory: `client`), with a `vercel.json` rewrite
  rule so client-side routes work on refresh.
- **Backend** is deployed on Render (root directory: `server`), configured with the same
  environment variables as above (using **live** Paystack/VTpass keys in production).
- MongoDB Atlas network access is set to allow connections from anywhere, since Render doesn't
  use static IPs on the free tier.

## Payment & Delivery Flow

1. A sponsor submits a recharge → the backend creates a `pending` transaction and initializes
   a Paystack transaction, returning a checkout URL.
2. The sponsor pays on Paystack's hosted checkout page.
3. Paystack confirms the payment via webhook (production) or a manual verification call
   (used during local development, since webhooks can't reach `localhost`).
4. The backend **independently re-verifies** the payment with Paystack directly before trusting it.
5. Once payment is confirmed, the backend purchases airtime via VTpass and updates the
   transaction status to `success` (or `delivery_failed` if VTpass delivery fails, in which case
   the payment is preserved and flagged for manual resolution — never silently lost).
6. The recipient is notified in-app and by email.

## Known Limitations / Roadmap

- **Data bundle delivery is simulated**, not yet live — VTpass sells data as fixed bundle SKUs
  per network, which needs a bundle-picker UI on the public page (Airtime is fully real and live).
- **Push and SMS notifications** are not yet implemented (in-app + email notifications are live).
- **Profile photo upload** is not yet connected to real image storage.
- Network (MTN/Airtel/Glo/9mobile) is currently **selected manually by the sponsor** on the
  public page rather than auto-detected from the recipient's phone number.

## License

This project was built as an academic/personal project and is not currently licensed for
commercial redistribution.
