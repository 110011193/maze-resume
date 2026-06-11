# Deploying to Vercel

## Required dashboard settings

| Setting | Value |
|--------|--------|
| **Root Directory** | **Empty** (recommended). If set to `src`, `src/vercel.json` runs install/build from the repo root. |
| **Framework Preset** | **Next.js** |
| **Output Directory** | **Empty** (override off). Do **not** set `public` — that is for static sites, not Next.js. |
| **Install Command** | Override **off**, or `npm install` |
| **Build Command** | Override **off**, or `npm run build` |

`package.json`, `prisma/`, `next.config.ts`, and `public/` live at the **repository root**.

## Environment variables

Set in Vercel → **Settings → Environment Variables** (see `.env.example`):

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL` → `https://<your-vercel-domain>.vercel.app`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `GEMINI_API_KEY`

Apply the database schema once, e.g. `npx prisma db push` with production `DATABASE_URL`.
