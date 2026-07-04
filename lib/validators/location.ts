import { z } from "zod";

// ─── Category enum ────────────────────────────────────────────────────────────

export const CATEGORIES = [
  "academic",
  "administrative",
  "health",
  "accommodation",
  "recreation",
  "worship",
  "transport",
  "food",
  "security",
  "other",
] as const;

export type Category = (typeof CATEGORIES)[number];

// ─── Location CRUD schema ─────────────────────────────────────────────────────

export const locationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  category: z.enum(CATEGORIES, { required_error: "Category is required" }),
  description: z.string().max(1000).optional(),
  address: z.string().max(500).optional(),
  latitude: z
    .number({ invalid_type_error: "Latitude must be a number" })
    .min(-90)
    .max(90),
  longitude: z
    .number({ invalid_type_error: "Longitude must be a number" })
    .min(-180)
    .max(180),
});

export type LocationInput = z.infer<typeof locationSchema>;

// ─── ID param schema (used by PUT and DELETE ?id=<number>) ───────────────────

export const idParamSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: "ID must be a number" })
    .int()
    .positive("ID must be a positive integer"),
});

export type IdParam = z.infer<typeof idParamSchema>;

// ─── Search query schema ──────────────────────────────────────────────────────

export const searchSchema = z.object({
  q: z.string().max(200).optional(),
  category: z.enum(CATEGORIES).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().positive().max(50_000).default(1000),
});

export type SearchQuery = z.infer<typeof searchSchema>;