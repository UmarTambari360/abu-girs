import { z } from "zod";

export const categoryValues = [
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

export type Category = (typeof categoryValues)[number];

export const locationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  category: z.enum(categoryValues),
  description: z.string().max(1000).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  latitude: z.coerce
    .number()
    .min(-90)
    .max(90),
  longitude: z.coerce
    .number()
    .min(-180)
    .max(180),
});

export type LocationInput = z.infer<typeof locationSchema>;

export const searchSchema = z.object({
  q: z.string().max(200).optional(),
  category: z.enum(categoryValues).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().min(1).max(50000).default(1000),
});

export type SearchInput = z.infer<typeof searchSchema>;