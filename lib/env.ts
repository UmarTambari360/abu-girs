// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

type Env = z.infer<typeof envSchema>;

let _validated: Env | null = null;

function getValidatedEnv(): Env {
  if (_validated) return _validated;

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`❌ Missing or invalid environment variables:\n${missing}`);
  }

  _validated = parsed.data;
  return _validated;
}

// Proxy defers all validation to the first property access.
// Nothing runs at import/module-evaluation time.
export const env = new Proxy({} as Env, {
  get(_target, prop: string) {
    return getValidatedEnv()[prop as keyof Env];
  },
});