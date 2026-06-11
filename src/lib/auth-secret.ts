/**
 * Fallback when AUTH_SECRET is not injected (e.g. Vercel env issues).
 * Auth.js reads AUTH_SECRET from process.env — config.secret alone is not enough.
 */
export const BAKED_AUTH_SECRET =
  "BA9iBXEgIPucpx7fIDA95R1L9EkrUz7r6ZTrxP7FYOQ=";

let secretFromPlatformEnv = false;

export function ensureAuthEnv(): string {
  const fromEnv =
    process.env.AUTH_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    process.env.AUTH_SECRET_1?.trim();

  if (fromEnv) {
    secretFromPlatformEnv = true;
    if (!process.env.AUTH_SECRET?.trim()) {
      process.env.AUTH_SECRET = fromEnv;
    }
    return fromEnv;
  }

  process.env.AUTH_SECRET = BAKED_AUTH_SECRET;
  return BAKED_AUTH_SECRET;
}

export function isAuthSecretFromEnv(): boolean {
  return secretFromPlatformEnv;
}
