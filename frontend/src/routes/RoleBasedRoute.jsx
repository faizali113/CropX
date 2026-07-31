import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../constants/roles';

/**
 * Restricts a route to users with one of the `allowedRoles`.
 * Unauthorised users are redirected to their own dashboard.
 */
export default function RoleBasedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    // Redirect to the user's correct dashboard rather than a generic 403
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
}
