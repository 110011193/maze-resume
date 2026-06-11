#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ensureSchema, findProjectRoot } from "../../../scripts/ensure-schema.mjs";

const shimDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = findProjectRoot(process.cwd());

ensureSchema(projectRoot);

const require = createRequire(import.meta.url);
const upstreamEntry = require.resolve("prisma-upstream/build/index.js");

const args = process.argv.slice(2);
const result = spawnSync(process.execPath, [upstreamEntry, ...args], {
  stdio: "inherit",
  cwd: projectRoot,
  env: process.env,
});

process.exit(result.status ?? 1);
