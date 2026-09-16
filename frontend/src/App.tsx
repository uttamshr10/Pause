import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import DailyCheckInPage from "./pages/checkin/DailyCheckInPage";
import CheckInHistoryPage from "./pages/checkin/CheckInHistoryPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import ReportsPage from "./pages/reports/ReportsPage";
import JournalPage from "./pages/journal/JournalPage";
import GoalSettingsPage from "./pages/settings/GoalSettingsPage";
import AchievementsPage from "./pages/achievements/AchievementsPage";
import RecommendationsPage from "./pages/recommendations/RecommendationsPage";
import ReflectionPage from "./pages/reflection/ReflectionPage";
import ActionPlanPage from "./pages/action-plan/ActionPlanPage";

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
          path="/reports"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ReportsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <JournalPage />
            </DashboardLayout>
          </ProtectedRoute>
       }
      />
      <Route
        path="/settings/goals"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GoalSettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AchievementsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <RecommendationsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reflection"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReflectionPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/action-plan"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ActionPlanPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      </Routes>
    </BrowserRouter>
  );
}

export default App;