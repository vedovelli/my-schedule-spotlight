import { Navigate, useLocation } from "react-router-dom";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading skeleton while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-60" />
                </div>
              </div>
              <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to sign in with return URL
  if (!user) {
    return (
      <Navigate to="/signin" state={{ from: location.pathname }} replace />
    );
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
