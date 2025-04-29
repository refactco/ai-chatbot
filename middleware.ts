/**
 * Next.js Middleware
 *
 * This file defines middleware functions executed before requests reach page routes.
 * Features:
 * - Route handling and redirection logic
 * - Path matching configuration
 * - Root path redirection to home page
 * - Request/response interception
 *
 * The middleware provides global request processing for the application,
 * ensuring proper routing behavior and access control.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Main middleware function
 * Processes incoming requests and applies routing rules
 * @param request - The incoming Next.js request object
 * @returns Modified response or passes request to next middleware
 */
export function middleware(request: NextRequest) {
  // Redirect root path to the chat page
  if (request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/', request.url));
  }

  return NextResponse.next();
}

/**
 * Middleware matcher configuration
 * Defines which routes this middleware should be applied to
 */
export const config = {
  matcher: ['/', '/:id', '/api/:path*', '/login', '/register'],
};
