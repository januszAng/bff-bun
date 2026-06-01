import { env } from "../env.js";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Path where migration SQL files will be generated
  out: "./drizzle",
  // Path to the database schema defined in the shared package
  schema: "../shared/src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // Fallback URL for local host machine development
    url: env.WEB_BFF_DATABASE_URL,
  },
});
