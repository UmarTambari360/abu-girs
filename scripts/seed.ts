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

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

const abuLocations = [
  {
    name: "ABU Senate Building",
    category: "administrative" as const,
    description:
      "The central administrative building of Ahmadu Bello University, housing the Senate chamber and principal offices.",
    address: "Senate Building Road, ABU Main Campus, Zaria",
    latitude: 11.1572,
    longitude: 7.6369,
  },
  {
    name: "Kashim Ibrahim Library",
    category: "academic" as const,
    description:
      "The main university library named after Sir Kashim Ibrahim, providing extensive academic resources and reading halls.",
    address: "Library Road, ABU Main Campus, Zaria",
    latitude: 11.156,
    longitude: 7.638,
  },
  {
    name: "Faculty of Engineering",
    category: "academic" as const,
    description:
      "Home to several engineering departments including Civil, Electrical, Mechanical, and Chemical Engineering.",
    address: "Engineering Road, ABU Main Campus, Zaria",
    latitude: 11.159,
    longitude: 7.634,
  },
  {
    name: "Faculty of Science",
    category: "academic" as const,
    description:
      "Houses departments of Physics, Chemistry, Mathematics, Biology, and Computer Science.",
    address: "Science Road, ABU Main Campus, Zaria",
    latitude: 11.158,
    longitude: 7.6395,
  },
  {
    name: "ABU Teaching Hospital (ABUTH)",
    category: "health" as const,
    description:
      "The main teaching hospital affiliated with ABU, providing medical services to the university community and the public.",
    address: "Shika, Zaria, Kaduna State",
    latitude: 11.173,
    longitude: 7.618,
  },
  {
    name: "University Health Centre",
    category: "health" as const,
    description:
      "On-campus health facility providing primary healthcare services to students and staff.",
    address: "Health Centre Road, ABU Main Campus, Zaria",
    latitude: 11.157,
    longitude: 7.636,
  },
  {
    name: "Sultan Bello Hall",
    category: "accommodation" as const,
    description:
      "One of the oldest and most prominent male student halls of residence on the main campus.",
    address: "Sultan Bello Road, ABU Main Campus, Zaria",
    latitude: 11.1545,
    longitude: 7.6352,
  },
  {
    name: "Aliyu Makama Hall",
    category: "accommodation" as const,
    description: "A female student hall of residence providing secured accommodation for female students.",
    address: "Aliyu Makama Road, ABU Main Campus, Zaria",
    latitude: 11.1538,
    longitude: 7.6372,
  },
  {
    name: "ABU Main Gate",
    category: "transport" as const,
    description:
      "The primary entrance and exit point of Ahmadu Bello University main campus.",
    address: "Samaru Road, Zaria, Kaduna State",
    latitude: 11.1625,
    longitude: 7.642,
  },
  {
    name: "Samaru Market",
    category: "food" as const,
    description:
      "The main market serving the ABU community, with food stalls, grocery shops, and everyday essentials.",
    address: "Samaru, Zaria, Kaduna State",
    latitude: 11.165,
    longitude: 7.645,
  },
  {
    name: "ABU Sports Complex",
    category: "recreation" as const,
    description:
      "University sports facilities including a stadium, tennis courts, and gymnasium for student recreation.",
    address: "Sports Complex Road, ABU Main Campus, Zaria",
    latitude: 11.152,
    longitude: 7.633,
  },
  {
    name: "University Mosque",
    category: "worship" as const,
    description:
      "The central mosque on campus serving the Muslim community of ABU.",
    address: "Mosque Road, ABU Main Campus, Zaria",
    latitude: 11.1558,
    longitude: 7.6378,
  },
  {
    name: "University Chapel",
    category: "worship" as const,
    description:
      "The Christian chapel on campus serving the Christian community of ABU.",
    address: "Chapel Road, ABU Main Campus, Zaria",
    latitude: 11.1548,
    longitude: 7.6362,
  },
  {
    name: "Faculty of Law",
    category: "academic" as const,
    description:
      "Houses the Department of Public Law and Private Law, and is home to the Moot Court.",
    address: "Faculty of Law Road, ABU Main Campus, Zaria",
    latitude: 11.1575,
    longitude: 7.6355,
  },
  {
    name: "Faculty of Social Sciences",
    category: "academic" as const,
    description:
      "Departments of Economics, Geography, Political Science, Psychology, and Sociology are housed here.",
    address: "Social Sciences Road, ABU Main Campus, Zaria",
    latitude: 11.156,
    longitude: 7.6345,
  },
  {
    name: "Kongo Campus Gate",
    category: "transport" as const,
    description:
      "Main entrance to the Kongo Campus of ABU, which hosts the Faculty of Arts and Social Sciences.",
    address: "Kongo Campus, Kaduna Road, Zaria",
    latitude: 11.118,
    longitude: 7.711,
  },
  {
    name: "University Bursary",
    category: "administrative" as const,
    description:
      "The financial services office for payment of school fees, salaries, and other financial transactions.",
    address: "Bursary Road, ABU Main Campus, Zaria",
    latitude: 11.1565,
    longitude: 7.6372,
  },
  {
    name: "Department of Computer Science",
    category: "academic" as const,
    description:
      "The academic department offering programmes in Computer Science within the Faculty of Physical Sciences.",
    address: "Faculty of Science Complex, ABU Main Campus, Zaria",
    latitude: 11.1583,
    longitude: 7.6398,
  },
  {
    name: "ABU Security Post — Main Gate",
    category: "security" as const,
    description:
      "The primary university security post at the main campus entrance, manned 24 hours.",
    address: "Main Gate, Samaru Road, Zaria",
    latitude: 11.1628,
    longitude: 7.6424,
  },
  {
    name: "University Guest House",
    category: "accommodation" as const,
    description:
      "Official university guest accommodation for visiting academics, dignitaries, and guests.",
    address: "Guest House Road, ABU Main Campus, Zaria",
    latitude: 11.155,
    longitude: 7.6332,
  },
];

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

    // Seed locations
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