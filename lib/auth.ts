import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: 'phone-otp',
      name: 'Phone OTP',
      credentials: {
        phone: { label: 'Telefone', type: 'text' },
      },
      async authorize(credentials) {
        const phone = credentials?.phone as string;
        if (!phone) return null;

        // Buscar ou criar usuario
        let user = await prisma.user.findUnique({
          where: { phone },
        });

        if (!user) {
          user = await prisma.user.create({
            data: { phone },
          });
        }

        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
          image: user.avatarUrl,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = (user as { phone?: string }).phone;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { phone?: string }).phone = token.phone as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
});
