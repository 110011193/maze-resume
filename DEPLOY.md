# Deploying to Vercel

## Root Directory

This app’s `package.json`, `prisma/`, and `next.config.ts` live at the **repository root**, not inside `src/`.

**Recommended:** Vercel → **Settings → General → Root Directory** → leave **empty**.

If Root Directory is set to `src`, `src/vercel.json` runs install/build from the repo root (`cd .. && npm …`).

## Environment variables

Copy from `.env.example`: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GEMINI_API_KEY`.

Apply the database schema once (e.g. `npx prisma db push` with production `DATABASE_URL`).

## Build settings

Use defaults or:

- **Install Command:** `npm install` (or override off)
- **Build Command:** `npm run build` (or override off)

Do not use a custom `prisma generate && next build` unless it matches `package.json` `build`.
