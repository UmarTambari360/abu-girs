import { z } from "zod";

export const categoryEnum = z.enum([
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
]);

export type Category = z.infer<typeof categoryEnum>;

// Used by GET /api/search
export const searchSchema = z.object({
  q: z.string().trim().optional(),
  category: categoryEnum.optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().positive().default(1000),
});

export type SearchParams = z.infer<typeof searchSchema>;

// Used by POST /api/admin/locations and PUT /api/admin/locations
export const locationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  category: categoryEnum,
  description: z.string().trim().max(1000).optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type LocationInput = z.infer<typeof locationSchema>;