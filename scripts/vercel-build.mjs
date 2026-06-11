import { execSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const cwd = process.cwd();
const schemaPath = join(cwd, "prisma", "schema.prisma");

if (!existsSync(schemaPath)) {
  console.error("[maze build] prisma/schema.prisma not found.");
  console.error("[maze build] cwd:", cwd);
  try {
    console.error("[maze build] files here:", readdirSync(cwd).join(", "));
  } catch {
    console.error("[maze build] could not read cwd");
  }
  console.error(
    "[maze build] In Vercel → Settings → General, set Root Directory to empty (repo root)."
  );
  process.exit(1);
}

execSync("prisma generate", { stdio: "inherit", cwd });
execSync("next build", { stdio: "inherit", cwd });
