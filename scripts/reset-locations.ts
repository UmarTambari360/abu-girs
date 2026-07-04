import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
});

const env = envSchema.parse(process.env);

import { locations } from "@/db/schema";

async function resetLocations(): Promise<void> {
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const db = drizzle(pool);

  console.log("🗑️  Clearing locations table...");

  try {
    await db.execute(sql`TRUNCATE TABLE ${locations} RESTART IDENTITY CASCADE;`);
    console.log("✅ locations table cleared and id sequence reset to 1.");
  } catch (error) {
    console.error("❌ Reset failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetLocations();