import { ensureAuthEnv } from "@/lib/auth-secret";
import { handlers } from "@/lib/auth";

ensureAuthEnv();

export const { GET, POST } = handlers;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
