import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));

export function findProjectRoot(startDir) {
  let dir = startDir;
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(dir, "package.json"))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return startDir;
}

export function ensureSchema(projectRoot = findProjectRoot(process.cwd())) {
  const source = join(scriptDir, "schema.prisma");
  if (!existsSync(source)) {
    throw new Error(`[maze] Missing scripts/schema.prisma (cwd=${process.cwd()})`);
  }

  const targets = [
    join(projectRoot, "schema.prisma"),
    join(projectRoot, "prisma", "schema.prisma"),
  ];

  mkdirSync(join(projectRoot, "prisma"), { recursive: true });

  for (const target of targets) {
    copyFileSync(source, target);
  }

  console.log("[maze] Prisma schema written to:");
  for (const target of targets) {
    console.log(`  - ${target}`);
  }

  return targets[0];
}

if (process.argv[1]?.endsWith("ensure-schema.mjs")) {
  ensureSchema();
}
