import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '@/env.mjs';
import { pagesOptions } from './pages-options';

export const authOptions: NextAuthOptions = {
  pages: {
    ...pagesOptions,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: token.user as typeof session.user,
        jwt: token.jwt as string, // jwt a la sesión
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.idToken = user.id;
        if ('jwt' in user && typeof user.jwt === 'string') {
          token.jwt = user.jwt; // guardar el jwt
        }
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {},
      async authorize(credentials: any) {
        try {
          const res = await fetch('https://reyleonback.s.cloudesarrollosmoyan.com/api/auth/local', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              identifier: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!res.ok) {
            return null;
          }

          const data = (await res.json()) as { jwt?: string; user?: any };

          if (data?.jwt && data?.user) {
            return {
              id: data.user.id,
              name: data.user.username || data.user.name,
              email: data.user.email,
              jwt: data.jwt,
              ...data.user,
            };
          }

          return null;
        } catch (error) {
          console.error('Error en authorize:', error);
          return null;
        }
      },
    }),
    
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID || '',
      clientSecret: env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
};
