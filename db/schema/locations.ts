import {
  doublePrecision,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
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

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: categoryEnum("category").notNull(),
  description: text("description"),
  address: text("address"),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type Category = typeof categoryEnum["enumValues"][number];