import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { findUserByEmail } from '@/lib/mockApi/authApi';
import { mockStorage } from '@/lib/mockApi/utils';
import { mockUsers } from '@/lib/mockApi/data';

import { authConfig } from './auth.config';
import { DUMMY_PASSWORD } from '@/lib/constants';

interface ExtendedSession extends Session {
  user: User;
}

// Use this secret in development mode to avoid the MissingSecret error
const DEV_SECRET = 'development-secret-key-not-for-production';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || DEV_SECRET,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        // Initialize mock storage if needed
        if (!mockStorage.getItem('users')) {
          mockStorage.setItem('users', mockUsers);
        }

        // For MSW mode in development, allow a mock user
        if (
          process.env.NODE_ENV === 'development' &&
          email === 'user@example.com' &&
          password === 'password'
        ) {
          return {
            id: '1',
            email: 'user@example.com',
            name: 'Test User',
          };
        }

        // Use mock API to find user
        const user = findUserByEmail(email);

        if (!user) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        // In mock mode, all test users use "password" as password
        if (password !== 'password') {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        return user as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});
