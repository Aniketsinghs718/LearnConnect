import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/register'];
  
  // Protected routes that require authentication
  const protectedRoutes = [
    '/marketplace',
    '/admin', 
    '/contributors',
    '/auth/profile'
  ];

  // Check if current path is a dynamic course route (e.g., /2023/comps/sem1)
  const isDynamicRoute = /^\/[^\/]+\/[^\/]+\/[^\/]+/.test(pathname);

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  ) || isDynamicRoute;

  // Enhanced middleware for better SEO and initial redirects
  if (isProtectedRoute) {
    // Check if we have any authentication token in cookies
    const authCookie = request.cookies.get('sb-access-token') || 
                      request.cookies.get('supabase-auth-token') ||
                      request.cookies.get('sb-refresh-token');

    // If no auth cookies found, likely not authenticated
    // Let client-side handle the detailed auth check, but provide a hint for SEO
    if (!authCookie) {
      // For SEO: add no-index header to prevent indexing of protected content
      const response = NextResponse.next();
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return response;
    }
  }
  
  // For public routes or when auth cookies exist, proceed normally
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
