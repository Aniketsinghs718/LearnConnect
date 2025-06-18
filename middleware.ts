import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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

  // If accessing a protected route, let the ProtectedRoute component handle auth
  // This middleware mainly helps with SEO and initial redirects
  
  // For now, let the client-side authentication handle the protection
  // The ProtectedRoute component will handle the actual authentication checks
  return NextResponse.next();
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
