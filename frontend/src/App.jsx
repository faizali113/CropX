import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { getDashboardPath } from './constants/roles';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import FarmerDashboard from './pages/dashboard/FarmerDashboard';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Route guards
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';

/* ─── Route tree ──────────────────────────────────────────────────────────── */
function AppRoutes() {
  const { user, loading } = useAuth();

  // Don't render routes until auth state is resolved
  if (loading) return null;

  const dashPath = user ? getDashboardPath(user.role) : null;

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth pages — redirect to dashboard if already signed in */}
        <Route
          path="/login"
          element={user ? <Navigate to={dashPath} replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to={dashPath} replace /> : <SignupPage />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:uidb64/:token" element={<VerifyEmailPage />} />

        {/* Short-form role redirects */}
        <Route path="/farmer" element={<Navigate to="/farmer/dashboard" replace />} />
        <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/farmer/dashboard"
            element={
              <RoleBasedRoute allowedRoles={['FARMER']}>
                <FarmerDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/customer/dashboard"
            element={
              <RoleBasedRoute allowedRoles={['CUSTOMER']}>
                <CustomerDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <RoleBasedRoute allowedRoles={['FARMER', 'CUSTOMER', 'ADMIN']}>
                <ProfilePage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <RoleBasedRoute allowedRoles={['FARMER', 'CUSTOMER', 'ADMIN']}>
                <SettingsPage />
              </RoleBasedRoute>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover
      />
    </>
  );
}

/* ─── Root ────────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
