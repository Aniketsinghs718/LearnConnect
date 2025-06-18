'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, profile, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeoutReached(true);
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (loading && !timeoutReached) return;

    // If loading has timed out, try to redirect to login
    if (timeoutReached && !isAuthenticated) {
      console.warn('Authentication check timed out, redirecting to login');
      if (!hasRedirected) {
        setHasRedirected(true);
        router.push(redirectTo);
      }
      return;
    }

    // If not authenticated, redirect to login
    if (!loading && !isAuthenticated) {
      if (!hasRedirected) {
        setHasRedirected(true);
        router.push(redirectTo);
      }
      return;
    }

    // If admin is required but user is not admin, redirect to marketplace
    if (!loading && isAuthenticated && requireAdmin && !profile?.is_admin) {
      if (!hasRedirected) {
        setHasRedirected(true);
        router.push('/marketplace');
      }
      return;
    }
  }, [user, profile, loading, isAuthenticated, requireAdmin, redirectTo, router, hasRedirected, timeoutReached]);

  // Show loading spinner while checking authentication (with timeout)
  if (loading && !timeoutReached) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If timeout reached and still loading, show error state
  if (timeoutReached && loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Authentication Timeout</h2>
          <p className="text-gray-400 mb-4">Taking too long to verify authentication</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (redirecting)
  if (!isAuthenticated) {
    return null;
  }

  // If admin required but user is not admin, show nothing (redirecting)
  if (requireAdmin && !profile?.is_admin) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
