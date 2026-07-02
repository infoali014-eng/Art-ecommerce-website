import { NextResponse } from 'next/server';

export function middleware() {
  // Reserved for future authentication and route protection.
  // E.g., verifying Supabase JWT tokens, managing user sessions, etc.
  return NextResponse.next();
}

// Config to specify matching routes for the middleware.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (local assets)
     */
    '/((?!api|_next/static|_next/image|assets|favicon.ico).*)',
  ],
};
