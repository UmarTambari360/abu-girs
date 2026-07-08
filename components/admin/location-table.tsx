// components/admin/location-table.tsx
"use client";

import { MapPin, Pencil, Trash2, Loader2 } from "lucide-react";
import { CategoryBadge } from "@/components/ui/category-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Location } from "@/types";

interface LocationTableProps {
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (id: number) => void;
  deleteConfirmId: number | null;
  setDeleteConfirmId: (id: number | null) => void;
  deletingId: number | null;
  sortField: "name" | "category" | "created_at";
  sortDir: "asc" | "desc";
  onSort: (field: "name" | "category" | "created_at") => void;
}

export function LocationTable({
  locations,
  onEdit,
  onDelete,
  deleteConfirmId,
  setDeleteConfirmId,
  deletingId,
  sortField,
  sortDir,
  onSort,
}: LocationTableProps) {
  if (locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <MapPin className="w-6 h-6 text-gray-500" />
        </div>
        <p className="text-sm font-medium text-gray-700">No locations found</p>
        <p className="text-xs text-gray-500 mt-1">
          Try a different search or add a new location.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="w-[200px]">
              <button
                onClick={() => onSort("name")}
                className="flex items-center gap-1 hover:text-gray-800 transition-colors font-semibold text-xs uppercase tracking-wide text-gray-600"
              >
                Name
                {sortField === "name" && (
                  <span className="text-green-700 ml-1">
                    {sortDir === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => onSort("category")}
                className="flex items-center gap-1 hover:text-gray-800 transition-colors font-semibold text-xs uppercase tracking-wide text-gray-600"
              >
                Category
                {sortField === "category" && (
                  <span className="text-green-700 ml-1">
                    {sortDir === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <span className="font-semibold text-xs uppercase tracking-wide text-gray-600">
                Description
              </span>
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <span className="font-semibold text-xs uppercase tracking-wide text-gray-600">
                Coordinates
              </span>
            </TableHead>
            <TableHead className="text-right">
              <span className="font-semibold text-xs uppercase tracking-wide text-gray-600">
                Actions
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((loc) => (
            <TableRow key={loc.id} className="hover:bg-gray-50/50 group">
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-green-700" />
                  </div>
                  <span className="font-medium text-gray-900 text-sm">
                    {loc.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <CategoryBadge category={loc.category} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <p className="text-gray-500 text-xs max-w-xs truncate">
                  {loc.description || (
                    <span className="text-gray-400 italic">No description</span>
                  )}
                </p>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="text-xs text-gray-400 font-mono">
                  {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(loc)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-green-700 hover:bg-green-50"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  {deleteConfirmId === loc.id ? (
                    <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                      <span className="text-xs text-red-700 font-medium whitespace-nowrap">
                        Delete?
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(loc.id)}
                        disabled={deletingId === loc.id}
                        className="h-6 px-2 text-xs font-semibold text-red-700 hover:text-red-900 hover:bg-red-100/50"
                      >
                        {deletingId === loc.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Yes"
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(null)}
                        className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                      >
                        No
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(loc.id)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
