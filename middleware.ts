import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple passthrough middleware
export function middleware(request: NextRequest) {
  // Redirect root path to the chat page
  if (request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/:id', '/api/:path*', '/login', '/register'],
};
