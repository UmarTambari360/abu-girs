import type { Category } from "@/lib/validators/location";

export type LocationCategory = Category;

export type Location = {
  id: number;
  name: string;
  category: Category;
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

// Form data type
export interface LocationFormData {
  name: string;
  category: LocationCategory;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
}

export type ApiSuccess<T> = {
  data: T;
};

export type ApiError = {
  error: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;