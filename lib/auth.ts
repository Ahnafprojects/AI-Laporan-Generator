import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            emailVerified: true,
            proExpiresAt: true,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // CEK EMAIL VERIFICATION - PENTING!
        if (!user.emailVerified) {
          throw new Error("Email belum diverifikasi. Silakan cek email Anda dan klik link verifikasi.");
        }

        const isProActive = !!(user.proExpiresAt && new Date(user.proExpiresAt) > new Date());

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isProActive,
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isProActive = (user as any).isProActive ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).isProActive = token.isProActive ?? false;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
