import { z } from "zod";

export const STAGES = {
  DEV: "development",
  TEST: "test",
  PROD: "production",
};
// Defining the Schema
// using .default() in case if variable is missing in the .env file
const envSchema = z.object({
  NODE_ENV: z.enum([STAGES.DEV, STAGES.PROD, STAGES.TEST]).default(STAGES.DEV),

  PORT: z.coerce.number().positive().default(3000),
  WEB_BFF_DATABASE_URL: z.string().startsWith("postgres://"),
  DB_POOL_MAX: z.coerce.number().positive().default(5),
  DB_CONNECT_TIMEOUT: z.coerce.number().positive().default(10),
  DB_IDLE_TIMEOUT: z.coerce.number().positive().default(30),
});

export type Env = z.infer<typeof envSchema>;

// Parsing and Validating
let env: Env;

try {
  console.log("🔍 Validating environment variables...");
  console.log(process.env); // Log the raw environment variables for debugging
  env = envSchema.parse(process.env);
} catch (err) {
  if (err instanceof z.ZodError) {
    console.error("❌ web-bff environment validation failed:");

    // This gives a clean breakdown of which variables are missing or wrong
    err.issues.forEach((issue) => {
      console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
    });

    process.exit(1);
  }
  throw err;
}

// Helper exports
export const isProd = () => env.NODE_ENV === STAGES.PROD;
export const isDev = () => env.NODE_ENV === STAGES.DEV;
export const isTest = () => env.NODE_ENV === STAGES.TEST;

export { env };
