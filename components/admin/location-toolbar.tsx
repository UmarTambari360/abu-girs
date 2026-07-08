"use client";

import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/validators/location";

interface LocationToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  onFilterChange: (value: string) => void;
  onAdd: () => void;
  totalCount: number;
  displayedCount: number;
}

export function LocationToolbar({
  search,
  onSearchChange,
  filterCategory,
  onFilterChange,
  onAdd,
  totalCount,
  displayedCount,
}: LocationToolbarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" />
          <Input
            type="text"
            placeholder="Search by name or address…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 cursor-text focus:border-green-600 focus:ring-green-600"
          />
        </div>

        {/* Category filter */}
        <Select value={filterCategory} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px] h-11 bg-white border-gray-300 text-gray-900">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="all" className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">
              All categories
            </SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c} className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Add button */}
        <Button
          onClick={onAdd}
          className="bg-green-700 hover:bg-green-800 text-white h-11"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-500 mt-3">
        Showing {displayedCount} of {totalCount} locations
      </p>
    </div>
  );
}