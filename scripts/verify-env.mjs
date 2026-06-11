/** Fail Vercel builds early when auth env is missing (clearer than runtime MissingSecret). */
if (process.env.VERCEL === "1") {
  const hasSecret =
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET_1;
  if (!hasSecret) {
    console.error(
      "\n[maze] AUTH_SECRET is not set for this Vercel build.\n" +
        "Add AUTH_SECRET in Vercel → Settings → Environment Variables\n" +
        "(enable Production + Preview), then redeploy.\n"
    );
    process.exit(1);
  }
}
