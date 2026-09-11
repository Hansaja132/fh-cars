import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-text-muted text-sm font-medium">
        Verifying authorization...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated visitors attempting to access /admin back to Home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
