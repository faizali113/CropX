import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getDashboardPath } from './constants/roles';

// Auth pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Dashboards
import FarmerDashboard from './pages/dashboard/FarmerDashboard';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Farmer pages (backend-connected only)
import FarmManager from './pages/farmer/FarmManager';
import MyCrops from './pages/farmer/MyCrops';
import Marketplace from './pages/farmer/Marketplace';
import Orders from './pages/farmer/Orders';
import DiseaseScanner from './pages/farmer/DiseaseScanner';
import FertilizerCenter from './pages/farmer/FertilizerCenter';
import Weather from './pages/farmer/Weather';
import CropPrices from './pages/farmer/CropPrices';
// Analytics and Reports removed — were 100% hardcoded with no backend connection
import Messages from './pages/farmer/Messages';
import Notifications from './pages/farmer/Notifications';

// Shared pages
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Route guards
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return null;
  const dashPath = user ? getDashboardPath(user.role) : null;

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to={dashPath} replace /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to={dashPath} replace /> : <SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:uidb64/:token" element={<VerifyEmailPage />} />

        {/* Role shortcuts */}
        <Route path="/farmer" element={<Navigate to="/farmer/dashboard" replace />} />
        <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          {/* Dashboards */}
          <Route path="/farmer/dashboard" element={<RoleBasedRoute allowedRoles={['FARMER']}><FarmerDashboard /></RoleBasedRoute>} />
          <Route path="/customer/dashboard" element={<RoleBasedRoute allowedRoles={['CUSTOMER']}><CustomerDashboard /></RoleBasedRoute>} />
          <Route path="/admin/dashboard" element={<RoleBasedRoute allowedRoles={['ADMIN']}><AdminDashboard /></RoleBasedRoute>} />

          {/* Farmer-only pages */}
          <Route path="/farmer/farms" element={<RoleBasedRoute allowedRoles={['FARMER','ADMIN']}><FarmManager /></RoleBasedRoute>} />
          <Route path="/farmer/crops" element={<RoleBasedRoute allowedRoles={['FARMER','ADMIN']}><MyCrops /></RoleBasedRoute>} />
          <Route path="/farmer/marketplace" element={<RoleBasedRoute allowedRoles={['FARMER','ADMIN']}><Marketplace /></RoleBasedRoute>} />
          <Route path="/farmer/orders" element={<RoleBasedRoute allowedRoles={['FARMER','ADMIN']}><Orders /></RoleBasedRoute>} />
          <Route path="/farmer/disease-scanner" element={<RoleBasedRoute allowedRoles={['FARMER','ADMIN']}><DiseaseScanner /></RoleBasedRoute>} />
          <Route path="/farmer/fertilizer" element={<RoleBasedRoute allowedRoles={['FARMER','ADMIN']}><FertilizerCenter /></RoleBasedRoute>} />
          <Route path="/farmer/weather" element={<RoleBasedRoute allowedRoles={['FARMER','ADMIN']}><Weather /></RoleBasedRoute>} />
          <Route path="/farmer/crop-prices" element={<RoleBasedRoute allowedRoles={['FARMER','ADMIN']}><CropPrices /></RoleBasedRoute>} />
          <Route path="/farmer/messages" element={<RoleBasedRoute allowedRoles={['FARMER','ADMIN']}><Messages /></RoleBasedRoute>} />
          <Route path="/farmer/notifications" element={<RoleBasedRoute allowedRoles={['FARMER','ADMIN']}><Notifications /></RoleBasedRoute>} />

          {/* Shared */}
          <Route path="/profile" element={<RoleBasedRoute allowedRoles={['FARMER','CUSTOMER','ADMIN']}><ProfilePage /></RoleBasedRoute>} />
          <Route path="/settings" element={<RoleBasedRoute allowedRoles={['FARMER','CUSTOMER','ADMIN']}><SettingsPage /></RoleBasedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right" autoClose={4000} hideProgressBar={false}
        newestOnTop closeOnClick pauseOnFocusLoss={false} pauseOnHover
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
