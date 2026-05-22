import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../contexts/useAuth';
import { USER_ROLE, type UserRole } from '../types/auth';
import { LoaidingAuth } from '#components/LoadingAuth';

interface PrivateRouteProps {
  allowedRoles?: UserRole[];
}

export function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoaidingAuth />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === USER_ROLE.USER) {
      return <Navigate to={`/users/${user.id}`} />;
    }
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
}
