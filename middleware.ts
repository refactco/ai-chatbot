import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';

import { authConfig } from '@/app/(auth)/auth.config';

// Original authentication middleware (commented out)
// export default NextAuth(authConfig).auth;

// Mock middleware that allows all access by always returning NextResponse.next()
export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/:id', '/api/:path*', '/login', '/register'],
};
