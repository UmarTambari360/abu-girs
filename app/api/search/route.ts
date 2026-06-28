import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { ilike, eq, and, sql } from "drizzle-orm";
import { searchSchema } from "@/lib/validators/location";
import type { SearchResult } from "@/types";

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = searchSchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { q, category, lat, lng, radius } = parsed.data;

  try {
    // Proximity search: use raw SQL with PostGIS earth_distance or the Haversine formula
    if (lat !== undefined && lng !== undefined) {
      // Uses PostGIS ST_DWithin for radius filter + ST_Distance for ordering
      // Distances are in metres (geography type)
      const rows = await db.execute<SearchResult>(sql`
        SELECT *,
          ST_Distance(
            ST_MakePoint(longitude, latitude)::geography,
            ST_MakePoint(${lng}, ${lat})::geography
          ) AS distance
        FROM locations
        WHERE
          ST_DWithin(
            ST_MakePoint(longitude, latitude)::geography,
            ST_MakePoint(${lng}, ${lat})::geography,
            ${radius}
          )
          ${category ? sql`AND category = ${category}` : sql``}
          ${q ? sql`AND name ILIKE ${"%" + q + "%"}` : sql``}
        ORDER BY distance ASC
        LIMIT 20
      `);

      return NextResponse.json({ data: rows.rows });
    }

    // Text + category search
    const filters = [];
    if (q) filters.push(ilike(locations.name, `%${q}%`));
    if (category) filters.push(eq(locations.category, category));

    const rows = await db
      .select()
      .from(locations)
      .where(filters.length ? and(...filters) : undefined)
      .limit(20);

    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
