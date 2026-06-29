import { z } from "zod";

export const CATEGORY_OPTIONS = [
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

export type CategoryOption = (typeof CATEGORY_OPTIONS)[number];

export const locationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  category: z.enum(CATEGORY_OPTIONS),
  description: z.string().max(1000).nullable().optional(),
  address: z.string().max(300).nullable().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type LocationInput = z.infer<typeof locationSchema>;

export const searchSchema = z.object({
  q: z.string().optional(),
  category: z.enum([...CATEGORY_OPTIONS, ""] as const).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().min(1).max(50000).default(1000),
});

export type SearchInput = z.infer<typeof searchSchema>;