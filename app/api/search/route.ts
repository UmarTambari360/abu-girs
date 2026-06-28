import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { sql, ilike, eq, and } from "drizzle-orm";
import { searchSchema } from "@/lib/validators/location";
import type { SearchResult } from "@/types";

export async function GET(req: NextRequest) {
  try {
    // 1. Parse and validate query params
    const { searchParams } = req.nextUrl;

    const raw = {
      q: searchParams.get("q") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      lat: searchParams.get("lat") ?? undefined,
      lng: searchParams.get("lng") ?? undefined,
      radius: searchParams.get("radius") ?? undefined,
    };

    const parsed = searchSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { q, category, lat, lng, radius } = parsed.data;

    // 2. Proximity search — PostGIS path
    if (lat !== undefined && lng !== undefined) {
      // ST_DWithin on geography type uses metres automatically.
      // ST_Distance likewise returns metres.
      // We cast the stored lat/lng columns into a geography point on the fly.
      const rows = await db.execute<
        SearchResult & { distance: number }
      >(sql`
        SELECT
          id,
          name,
          category,
          description,
          address,
          latitude,
          longitude,
          created_at  AS "createdAt",
          updated_at  AS "updatedAt",
          ROUND(
            ST_Distance(
              ST_MakePoint(longitude, latitude)::geography,
              ST_MakePoint(${lng}, ${lat})::geography
            )::numeric,
            2
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

    // 3. Text / category search — Drizzle query builder path
    const filters = [];

    if (q) {
      filters.push(ilike(locations.name, `%${q}%`));
    }

    if (category) {
      filters.push(eq(locations.category, category));
    }

    const rows = await db
      .select()
      .from(locations)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(locations.name)
      .limit(20);

    return NextResponse.json({ data: rows as SearchResult[] });
  } catch (error) {
    console.error("[GET /api/search]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}