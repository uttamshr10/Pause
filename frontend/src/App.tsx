import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import DailyCheckInPage from "./pages/checkin/DailyCheckInPage";
import CheckInHistoryPage from "./pages/checkin/CheckInHistoryPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import OnboardingPage from "./pages/onboarding/OnboardingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/check-in"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DailyCheckInPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/check-in/history"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CheckInHistoryPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;