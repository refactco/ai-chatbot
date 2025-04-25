import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUser } from '@/lib/db/queries';

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
        // For MSW mode in development, allow a mock user
        if (process.env.NODE_ENV === 'development' && 
            email === 'user@example.com' && 
            password === 'password') {
          return {
            id: '1',
            email: 'user@example.com',
            name: 'Test User'
          };
        }
        
        const users = await getUser(email);

        if (users.length === 0) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const [user] = users;

        if (!user.password) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const passwordsMatch = await compare(password, user.password);

        if (!passwordsMatch) return null;

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
