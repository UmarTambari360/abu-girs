import type { categoryEnum } from "@/lib/validators/location";

export type Location = {
  id: number;
  name: string;
  category: typeof categoryEnum;
  description: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
};

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