import React from 'react';
import { AuthService } from '../services/authService';
import { hasRole, hasHigherRole, USER_ROLES } from '../constants/roles';

/**
 * Hook to check if current user has a specific role
 */
export const useHasRole = (role: string | string[]): boolean => {
  const [hasAccess, setHasAccess] = React.useState(false);

  React.useEffect(() => {
    const user = AuthService.getUser();
    if (user) {
      setHasAccess(hasRole(user.role, role));
    }
  }, [role]);

  return hasAccess;
};

/**
 * Hook to check if current user has higher role than minimum required
 */
export const useHasHigherRole = (minRole: string): boolean => {
  const [hasAccess, setHasAccess] = React.useState(false);

  React.useEffect(() => {
    const user = AuthService.getUser();
    if (user) {
      setHasAccess(hasHigherRole(user.role, minRole));
    }
  }, [minRole]);

  return hasAccess;
};

/**
 * Hook to get current user
 */
export const useCurrentUser = () => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};

/**
 * Component: Render content only if user has role
 */
interface RoleGateProps {
  children: React.ReactNode;
  role: string | string[];
  fallback?: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({ children, role, fallback = null }) => {
  const hasAccess = useHasRole(role);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Component: Show component only if user has higher role
 */
interface RoleHierarchyGateProps {
  children: React.ReactNode;
  minRole: string;
  fallback?: React.ReactNode;
}

export const RoleHierarchyGate: React.FC<RoleHierarchyGateProps> = ({ children, minRole, fallback = null }) => {
  const hasAccess = useHasHigherRole(minRole);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Component: Protected Route Wrapper
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, fallback }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [hasAccess, setHasAccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = AuthService.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated && requiredRole) {
          const user = AuthService.getUser();
          setHasAccess(hasRole(user.role, requiredRole));
        } else {
          setHasAccess(authenticated);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-slate-600 mb-4">You need to be logged in to access this page.</p>
          {fallback}
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">❌ You don't have permission to access this page.</p>
          {fallback}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Component: Show user role badge
 */
interface RoleBadgeProps {
  role?: string;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = '' }) => {
  const { user } = useCurrentUser();
  const displayRole = role || user?.role;

  if (!displayRole) return null;

  const roleColors: Record<string, { bg: string; text: string }> = {
    [USER_ROLES.SUPER_ADMIN]: { bg: 'rgba(192, 132, 252, 0.1)', text: '#c084fc' },
    [USER_ROLES.ADMIN]: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' },
    [USER_ROLES.SUB_ACCOUNT]: { bg: 'rgba(0, 170, 255, 0.1)', text: '#00aaff' },
  };

  const colors = roleColors[displayRole] || { bg: 'rgba(0, 170, 255, 0.1)', text: '#00aaff' };

  const formattedRole = displayRole
    .split('_')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <span
      style={{ backgroundColor: colors.bg, color: colors.text }}
      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${className}`}
    >
      {formattedRole}
    </span>
  );
};
