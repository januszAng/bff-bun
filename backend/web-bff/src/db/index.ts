import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@bffbun/shared";
import { env } from "../../env.js";

// Disable prefetching to work smoothly with serverless/containerized environments
const client = postgres(env.WEB_BFF_DATABASE_URL, { max: 1 });

// Initialize Drizzle with the shared database schema
export const db = drizzle(client, { schema });
