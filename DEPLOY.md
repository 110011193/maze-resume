# Deploying to Vercel

## Required dashboard settings

| Setting | Value |
|--------|--------|
| **Root Directory** | **Empty** (recommended). If set to `src`, `src/vercel.json` runs install/build from the repo root. |
| **Framework Preset** | **Next.js** |
| **Output Directory** | **Empty** (override off). Do **not** set `public`. |
| **Install / Build Command** | Overrides **off**, or `npm install` / `npm run build` |

`package.json`, `prisma/`, `next.config.ts`, and `public/` live at the **repository root**.

## Environment variables (Production + Preview)

Set in Vercel → **Settings → Environment Variables**:

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | Yes | Neon/Postgres connection string (`?sslmode=require` for Neon) |
| `AUTH_SECRET` | **Yes** | `openssl rand -base64 32` — without this, logs show `MissingSecret` and sign-in returns 500 |
| `AUTH_URL` | Yes (prod) | `https://<your-production-domain>.vercel.app` — no trailing slash |
| `GOOGLE_CLIENT_ID` | For Google login | |
| `GOOGLE_CLIENT_SECRET` | For Google login | |
| `GEMINI_API_KEY` | For resume audit | |

Optional: `AUTH_TRUST_HOST=true` (also enabled in code via `trustHost: true`).

After adding `DATABASE_URL`, apply schema once:

```bash
DATABASE_URL="your-neon-url" npx prisma db push
```

### Google OAuth redirect URIs

In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), add **Authorized redirect URIs**:

- `https://<your-production-domain>.vercel.app/api/auth/callback/google`
- `https://<your-preview-domain>.vercel.app/api/auth/callback/google` (or use a stable preview URL)

### Verify deployment

Open `https://<your-app>.vercel.app/api/health` — all flags should be `true` before sign-in will work.

If you see **Server error** on `/api/auth/error`, check Vercel **Functions** logs and fix any `false` values from `/api/health`.
