import { NextResponse } from "next/server";

/** Safe env check for production debugging (no secret values exposed). */
export async function GET() {
  return NextResponse.json({
    ok: Boolean(process.env.AUTH_SECRET && process.env.DATABASE_URL),
    authSecret: Boolean(process.env.AUTH_SECRET),
    databaseUrl: Boolean(process.env.DATABASE_URL),
    authUrl: Boolean(process.env.AUTH_URL),
    googleOAuth: Boolean(
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ),
    gemini: Boolean(process.env.GEMINI_API_KEY),
  });
}
