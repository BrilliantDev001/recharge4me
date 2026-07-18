const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const rechargeRoutes = require("./routes/recharge.routes");
const transactionRoutes = require("./routes/transaction.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const settingsRoutes = require("./routes/settings.routes");
const notificationRoutes = require("./routes/notification.routes");
const supportRoutes = require("./routes/support.routes");
const paystackWebhookController = require("./controllers/webhooks/paystackWebhook.controller");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// IMPORTANT: this must be registered BEFORE express.json() below.
// Paystack's webhook signature is computed over the raw request bytes —
// if express.json() parses the body first, the signature check breaks.
app.post(
  "/api/webhooks/paystack",
  express.raw({ type: "application/json" }),
  paystackWebhookController,
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Recharge4Me API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/recharge", rechargeRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/support", supportRoutes);

module.exports = app;
