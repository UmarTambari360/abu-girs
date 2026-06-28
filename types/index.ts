import type { Location } from "@/db/schema/locations";

export type SearchResult = Location & {
  distance?: number;
};

export type ApiSuccess<T> = {
  data: T;
};

export type ApiError = {
  error: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;