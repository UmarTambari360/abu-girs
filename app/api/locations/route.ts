import { NextResponse } from "next/server";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { asc } from "drizzle-orm";
import type { Location } from "@/types";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(locations)
      .orderBy(asc(locations.name));

    return NextResponse.json({ data: rows as Location[] });
  } catch (error) {
    console.error("[GET /api/locations]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}