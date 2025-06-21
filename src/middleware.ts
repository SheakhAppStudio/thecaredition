import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface Token {
  role?: string;
  permissions?: string[];
  email?: string;
}

// Define admin routes that require authentication
const ADMIN_ROUTES = [
  '/dashboard',
  '/dashboard/add-services',
  '/dashboard/services-list',
  '/dashboard/customer-directory',
  '/dashboard/bookings/new',
  '/dashboard/bookings/booked-services',
  '/dashboard/bookings/waiting-response',
  '/dashboard/bookings/completed',
  '/dashboard/bookings/cancelled-jobs',
  '/dashboard/add-shop',
  '/dashboard/shop-list',
  '/dashboard/add-blog',
  '/dashboard/blog-list',
  '/dashboard/add-video',
  '/dashboard/video-list',
  '/dashboard/settings'
];

export const middleware = async (req: NextRequest): Promise<NextResponse> => {
  const token = await getToken({ req }) as Token;
  const path = req.nextUrl.pathname;
console.log(token)
  // Check if the requested path is an admin route
  const isAdminRoute = ADMIN_ROUTES.some(route => 
    path === route || path.startsWith(`${route}/`)
  );

  // If not an admin route, continue
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // If no token and trying to access admin route, redirect to login
  if (!token && isAdminRoute) {
    const callbackUrl = encodeURIComponent(path);
    return NextResponse.redirect(new URL(`/api/auth/signin?callbackUrl=${callbackUrl}`, req.url));
  }

  // If token exists but no role (shouldn't happen with proper auth setup)
  if (!token?.role && isAdminRoute) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }

  // Check for admin roles (add your specific admin roles here)
  const isAdmin = [
    'admin' // Add any other admin roles you have
  ].includes(token?.role || '');

  // If not an admin, redirect to login or unauthorized page
  if (!isAdmin && isAdminRoute) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // For admin routes that don't require specific permissions
  return NextResponse.next();
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api/auth routes (NextAuth)
     * - static files
     * - images
     * - favicon.ico
     * - public routes
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|auth|login|signin|signup|unauthorized).*)',
  ],
};