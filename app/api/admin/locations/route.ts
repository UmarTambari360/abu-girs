import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { auth } from "@/lib/auth";
import { locationSchema, idParamSchema } from "@/lib/validators/location";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── Auth guard helper ────────────────────────────────────────────────────────

async function requireAuth(): Promise<NextResponse | null> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// ─── POST /api/admin/locations ────────────────────────────────────────────────
// Creates a new location. Returns the created row with status 201.

export async function POST(req: NextRequest): Promise<NextResponse> {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body: unknown = await req.json();
    const parsed = locationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { name, category, description, address, latitude, longitude } =
      parsed.data;

    const [created] = await db
      .insert(locations)
      .values({
        name,
        category,
        description: description ?? null,
        address: address ?? null,
        latitude,
        longitude,
      })
      .returning();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/locations]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/admin/locations?id=<number> ────────────────────────────────────
// Updates an existing location. Returns the updated row.

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    // Validate the ?id= query param
    const { searchParams } = new URL(req.url);
    const paramParsed = idParamSchema.safeParse({ id: searchParams.get("id") });

    if (!paramParsed.success) {
      return NextResponse.json(
        { error: "Invalid or missing location ID" },
        { status: 400 }
      );
    }

    const { id } = paramParsed.data;

    // Validate request body
    const body: unknown = await req.json();
    const bodyParsed = locationSchema.safeParse(body);

    if (!bodyParsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: bodyParsed.error.flatten() },
        { status: 422 }
      );
    }

    const { name, category, description, address, latitude, longitude } =
      bodyParsed.data;

    const [updated] = await db
      .update(locations)
      .set({
        name,
        category,
        description: description ?? null,
        address: address ?? null,
        latitude,
        longitude,
        updatedAt: new Date(),
      })
      .where(eq(locations.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/admin/locations]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/admin/locations?id=<number> ─────────────────────────────────
// Deletes a location by ID. Returns 204 No Content on success.

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const parsed = idParamSchema.safeParse({ id: searchParams.get("id") });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid or missing location ID" },
        { status: 400 }
      );
    }

    const { id } = parsed.data;

    const [deleted] = await db
      .delete(locations)
      .where(eq(locations.id, id))
      .returning({ id: locations.id });

    if (!deleted) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/admin/locations]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}