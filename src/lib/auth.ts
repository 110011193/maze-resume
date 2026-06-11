import NextAuth, { type NextAuthResult } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export function resolveAuthSecret(): string | undefined {
  return (
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    process.env.AUTH_SECRET_1
  );
}

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

let authInstance: NextAuthResult | undefined;

export function getAuth(): NextAuthResult {
  const secret = resolveAuthSecret();
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not set. Add it in Vercel Environment Variables and redeploy."
    );
  }

  if (!authInstance) {
    authInstance = NextAuth({
      trustHost: true,
      secret,
      adapter: PrismaAdapter(prisma),
      providers: [
        ...(googleClientId && googleClientSecret
          ? [
              Google({
                clientId: googleClientId,
                clientSecret: googleClientSecret,
                allowDangerousEmailAccountLinking: true,
                profile(profile) {
                  return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                  };
                },
              }),
            ]
          : []),
        Credentials({
          name: "credentials",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            const parsed = credentialsSchema.safeParse(credentials);
            if (!parsed.success) return null;

            const { email, password } = parsed.data;

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user || !user.password) return null;

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return null;

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            };
          },
        }),
      ],
      session: {
        strategy: "jwt",
      },
      pages: {
        signIn: "/login",
        error: "/login",
      },
      events: {
        async signIn({ user, account, profile }) {
          if (account?.provider !== "google" || !user.id) return;
          const picture = (profile as { picture?: string } | undefined)
            ?.picture;
          if (!picture) return;
          await prisma.user.update({
            where: { id: user.id },
            data: { image: picture },
          });
        },
      },
      callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
            if (user.image) token.picture = user.image;
          }

          if (token.id && !token.picture) {
            const dbUser = await prisma.user.findUnique({
              where: { id: token.id as string },
              select: { image: true },
            });
            if (dbUser?.image) token.picture = dbUser.image;
          }

          return token;
        },
        async session({ session, token }) {
          if (token && session.user) {
            session.user.id = token.id as string;
            session.user.image =
              (token.picture as string | undefined) ?? session.user.image;
          }
          return session;
        },
      },
    });
  }

  return authInstance;
}

export const handlers = {
  GET: (req: Parameters<NextAuthResult["handlers"]["GET"]>[0]) =>
    getAuth().handlers.GET(req),
  POST: (req: Parameters<NextAuthResult["handlers"]["POST"]>[0]) =>
    getAuth().handlers.POST(req),
};

export const auth = ((...args: Parameters<NextAuthResult["auth"]>) =>
  getAuth().auth(...args)) as NextAuthResult["auth"];

export const signIn = ((...args: Parameters<NextAuthResult["signIn"]>) =>
  getAuth().signIn(...args)) as NextAuthResult["signIn"];

export const signOut = ((...args: Parameters<NextAuthResult["signOut"]>) =>
  getAuth().signOut(...args)) as NextAuthResult["signOut"];
