// components/admin/location-form.tsx
"use client";

import { useEffect } from "react";
import { X, Loader2, TriangleAlert } from "lucide-react";
import { CATEGORIES } from "@/lib/validators/location";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LocationFormData, LocationCategory } from "@/types";

interface LocationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: LocationFormData;
  onFormChange: (data: LocationFormData) => void;
  onSave: () => void;
  isSaving: boolean;
  error: string | null;
  editingId: number | null;
}

export function LocationForm({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSave,
  isSaving,
  error,
  editingId,
}: LocationFormProps) {
  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleFieldChange = (
    field: keyof LocationFormData,
    value: string | LocationCategory,
  ) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {editingId !== null ? "Edit Location" : "Add New Location"}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="flex items-start gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
            <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          {/* Name - Full Width */}
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="e.g. Faculty of Science"
              className="h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-sm font-medium text-gray-700"
            >
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                handleFieldChange("category", value as LocationCategory)
              }
            >
              <SelectTrigger className="h-11 bg-white border-gray-300 text-gray-900">
                <SelectValue
                  placeholder="Select category"
                  className="text-gray-900"
                />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {CATEGORIES.map((c) => (
                  <SelectItem
                    key={c}
                    value={c}
                    className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label
              htmlFor="address"
              className="text-sm font-medium text-gray-700"
            >
              Address
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              placeholder="e.g. Main Campus, Zaria"
              className="h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Latitude */}
          <div className="space-y-2">
            <Label
              htmlFor="latitude"
              className="text-sm font-medium text-gray-700"
            >
              Latitude <span className="text-red-500">*</span>
            </Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => handleFieldChange("latitude", e.target.value)}
              placeholder="e.g. 11.1572"
              className="h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Longitude */}
          <div className="space-y-2">
            <Label
              htmlFor="longitude"
              className="text-sm font-medium text-gray-700"
            >
              Longitude <span className="text-red-500">*</span>
            </Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => handleFieldChange("longitude", e.target.value)}
              placeholder="e.g. 7.6369"
              className="h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Description - Full Width */}
          <div className="sm:col-span-2 space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              rows={3}
              placeholder="Brief description of this location…"
              className="resize-none bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="h-11 bg-green-700 hover:bg-green-800 text-white min-w-[120px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                Saving…
              </>
            ) : editingId !== null ? (
              "Save Changes"
            ) : (
              "Create Location"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
