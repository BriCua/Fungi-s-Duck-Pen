import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Spinner } from './ui';

interface ProtectedRouteProps {
  // If true, user must NOT be authenticated (e.g., for AuthPage itself)
  isAuthPage?: boolean;
  // If true, user must be authenticated AND NOT have a coupleId (e.g., CoupleLinkingPage)
  requiresCoupleLinking?: boolean;
  // If true, user must be authenticated AND have a coupleId (e.g., main app pages)
  requiresAuthAndCouple?: boolean;
  children: ReactNode; // Add children prop
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthPage = false,
  requiresCoupleLinking = false,
  requiresAuthAndCouple = false,
  children, // Destructure children
}) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Logic for AuthPage: Should not be accessible if user is authenticated
  if (isAuthPage) {
    if (user) {
      if (!user.coupleId) {
        return <Navigate to="/link-couple" replace />;
      }
      return <Navigate to="/" replace />;
    }
    return <>{children}</>; // Render children if not authenticated
  }

  // Logic for routes requiring authentication
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Logic for CoupleLinkingPage: Requires auth but NO coupleId
  if (requiresCoupleLinking) {
    if (user.coupleId) {
      return <Navigate to="/" replace />; // If user already has a couple, go to main
    }
    return <>{children}</>; // Render children if authenticated but no couple
  }

  // Logic for routes requiring authentication AND a coupleId
  if (requiresAuthAndCouple) {
    if (!user.coupleId) {
      return <Navigate to="/link-couple" replace />; // If no couple, go to couple linking
    }
    return <>{children}</>; // Render children if authenticated and has couple
  }

  // Fallback, e.g., for a generic protected route that just needs auth
  return <>{children}</>;
};

export default ProtectedRoute;
