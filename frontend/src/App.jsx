import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to={getDashboardPath(user.role)} replace /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to={getDashboardPath(user.role)} replace /> : <SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:uidb64/:token" element={<VerifyEmailPage />} />
        <Route path="/farmer" element={<Navigate to="/farmer/dashboard" replace />} />
        <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/farmer/dashboard" element={<RoleBasedRoute allowedRoles={['FARMER']}><FarmerDashboard /></RoleBasedRoute>} />
          <Route path="/customer/dashboard" element={<RoleBasedRoute allowedRoles={['CUSTOMER']}><CustomerDashboard /></RoleBasedRoute>} />
          <Route path="/admin/dashboard" element={<RoleBasedRoute allowedRoles={['ADMIN']}><AdminDashboard /></RoleBasedRoute>} />
          <Route path="/profile" element={<RoleBasedRoute allowedRoles={['FARMER', 'CUSTOMER', 'ADMIN']}><ProfilePage /></RoleBasedRoute>} />
          <Route path="/settings" element={<RoleBasedRoute allowedRoles={['FARMER', 'CUSTOMER', 'ADMIN']}><SettingsPage /></RoleBasedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
}

function getDashboardPath(role) {
  switch (role) {
    case 'FARMER':
      return '/farmer/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/customer/dashboard';
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
