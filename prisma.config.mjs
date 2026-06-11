import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  schema: path.join(root, "schema.prisma"),
  migrations: {
    path: path.join(root, "prisma", "migrations"),
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
