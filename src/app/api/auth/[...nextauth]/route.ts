import { handlers, resolveAuthSecret } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function missingSecretResponse() {
  return NextResponse.json(
    {
      error: "MissingSecret",
      message:
        "AUTH_SECRET is not available in this deployment. In Vercel: Settings → Environment Variables → add AUTH_SECRET (Production + Preview), then Redeploy.",
      checked: {
        AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
        NEXTAUTH_SECRET: Boolean(process.env.NEXTAUTH_SECRET),
        AUTH_SECRET_1: Boolean(process.env.AUTH_SECRET_1),
      },
    },
    { status: 503 }
  );
}

export async function GET(request: NextRequest) {
  if (!resolveAuthSecret()) return missingSecretResponse();
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not set in environment variables." },
      { status: 503 }
    );
  }
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  if (!resolveAuthSecret()) return missingSecretResponse();
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not set in environment variables." },
      { status: 503 }
    );
  }
  return handlers.POST(request);
}
