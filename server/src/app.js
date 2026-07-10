// const express = require("express");
// const cors = require("cors");
// const authRoutes = require("./routes/auth.routes");
// const rechargeRoutes = require("./routes/recharge.routes");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/recharge", rechargeRoutes);

// module.exports = app;
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const rechargeRoutes = require("./routes/recharge.routes");
const transactionRoutes = require("./routes/transaction.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const settingsRoutes = require("./routes/settings.routes");

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Recharge4Me API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/recharge", rechargeRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);

module.exports = app;