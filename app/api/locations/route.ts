import { NextResponse } from "next/server";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(locations)
      .orderBy(asc(locations.name));
    return NextResponse.json({ data: rows });
  } catch {
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}
