import { handlers } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function assertAuthEnv() {
  const missing: string[] = [];
  if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
    missing.push("AUTH_SECRET");
  }
  if (!process.env.DATABASE_URL) {
    missing.push("DATABASE_URL");
  }
  if (missing.length === 0) return null;

  return NextResponse.json(
    {
      error: "Auth is not configured on the server.",
      missing,
      hint: "Add these in Vercel → Settings → Environment Variables, then redeploy.",
    },
    { status: 503 }
  );
}

export async function GET(request: NextRequest) {
  const configError = assertAuthEnv();
  if (configError) return configError;
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  const configError = assertAuthEnv();
  if (configError) return configError;
  return handlers.POST(request);
}
