import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing.jsx";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import EmailVerification from "./pages/EmailVerification/EmailVerification.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import RechargeLink from "./pages/RechargeLink/RechargeLink.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import Transactions from "./pages/Transactions/Transactions.jsx";
import PublicRechargePage from "./pages/PublicRechargePage/PublicRechargePage.jsx";
import PaymentSuccess from "./pages/PaymentSuccess/PaymentSuccess.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService/TermsOfService.jsx";
import Support from "./pages/Support/Support.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recharge-link"
        element={
          <ProtectedRoute>
            <RechargeLink />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route path="/u/:username" element={<PublicRechargePage />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/support" element={<Support />} />
      <Route
        path="*"
        element={
          <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            Page not found.
          </div>
        }
      />
    </Routes>
  );
}

export default App;
