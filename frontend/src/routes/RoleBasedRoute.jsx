import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleBasedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}
