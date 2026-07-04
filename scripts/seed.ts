import { createHash } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),
});

const env = envSchema.parse(process.env);

import { locations, users } from "@/db/schema";
import { abuLocations } from "./seed-data";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function seed(): Promise<void> {
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const db = drizzle(pool);

  console.log("🌱 Starting seed...");

  try {
    // Seed admin user
    console.log("👤 Seeding admin user...");
    await db
      .insert(users)
      .values({
        email: env.ADMIN_EMAIL,
        passwordHash: hashPassword(env.ADMIN_PASSWORD),
      })
      .onConflictDoNothing();
    console.log(`   ✓ Admin user: ${env.ADMIN_EMAIL}`);

    // Seed locations — real, OSM-derived ABU Zaria data (see scripts/seed-data.ts)
    console.log("📍 Seeding locations...");
    await db.insert(locations).values(abuLocations).onConflictDoNothing();
    console.log(`   ✓ ${abuLocations.length} locations seeded`);

    console.log("✅ Seed complete!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();