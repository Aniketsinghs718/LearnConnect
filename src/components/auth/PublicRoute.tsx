'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function PublicRoute({ 
  children, 
  redirectTo = '/' 
}: PublicRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // If already authenticated, redirect away from auth pages
    if (isAuthenticated) {
      router.push(redirectTo);
      return;
    }
  }, [isAuthenticated, loading, redirectTo, router]);

  // Show loading or nothing while checking authentication
  if (loading || isAuthenticated) {
    return null;
  }

  // Render public content for unauthenticated users
  return <>{children}</>;
}
