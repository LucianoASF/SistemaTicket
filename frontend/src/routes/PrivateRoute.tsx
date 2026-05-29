import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../contexts/useAuth';
import { type UserRole, USER_ROLE } from '../types/role';
import { LoadingAuth } from '#components/loadings/LoadingAuth';

interface PrivateRouteProps {
  allowedRoles?: UserRole[];
}

export function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingAuth />;
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
