import { handlers } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not set in environment variables." },
      { status: 503 }
    );
  }
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not set in environment variables." },
      { status: 503 }
    );
  }
  return handlers.POST(request);
}
