"use client";

import { useState, useCallback } from "react";
import type { Location, LocationFormData, LocationCategory } from "@/types";
import { LocationToolbar } from "@/components/admin/location-toolbar";
import { LocationTable } from "@/components/admin/location-table";
import { LocationForm } from "@/components/admin/location-form";
import { Card } from "@/components/ui/card";

type SortField = "name" | "category" | "created_at";
type SortDir = "asc" | "desc";

const EMPTY_FORM: LocationFormData = {
  name: "",
  category: "academic",
  description: "",
  address: "",
  latitude: "",
  longitude: "",
};

export default function AdminLocationsClient({
  initialLocations,
}: {
  initialLocations: Location[];
}) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<LocationFormData>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // ── Derived list ──────────────────────────────────────────────
  const displayed = locations
    .filter((l) => {
      const matchSearch =
        search.trim() === "" ||
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        (l.address ?? "").toLowerCase().includes(search.toLowerCase());
      const matchCat =
        filterCategory === "all" || l.category === filterCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = a.name.localeCompare(b.name);
      else if (sortField === "category")
        cmp = a.category.localeCompare(b.category);
      else
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });

  // ── Sort toggle ───────────────────────────────────────────────
  const toggleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir("asc");
      }
    },
    [sortField],
  );

  // ── Form helpers ──────────────────────────────────────────────
  const openAdd = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (loc: Location) => {
    setEditingId(loc.id);
    setFormData({
      name: loc.name,
      category: loc.category,
      description: loc.description ?? "",
      address: loc.address ?? "",
      latitude: String(loc.latitude),
      longitude: String(loc.longitude),
    });
    setFormError(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
  };

  // ── Save (create / update) ────────────────────────────────────
  const handleSave = async () => {
    if (!formData.name.trim()) {
      setFormError("Name is required.");
      return;
    }
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (isNaN(lat) || isNaN(lng)) {
      setFormError("Latitude and longitude must be valid numbers.");
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const body = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim() || null,
        address: formData.address.trim() || null,
        latitude: lat,
        longitude: lng,
      };

      if (editingId !== null) {
        const res = await fetch(`/api/admin/locations?id=${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const json = (await res.json()) as { error?: string };
          throw new Error(json.error ?? "Failed to update location.");
        }
        const json = (await res.json()) as { data: Location };
        setLocations((prev) =>
          prev.map((l) => (l.id === editingId ? json.data : l)),
        );
      } else {
        const res = await fetch("/api/admin/locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const json = (await res.json()) as { error?: string };
          throw new Error(json.error ?? "Failed to create location.");
        }
        const json = (await res.json()) as { data: Location };
        setLocations((prev) =>
          [...prev, json.data].sort((a, b) => a.name.localeCompare(b.name)),
        );
      }
      closeForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/locations?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        throw new Error(json.error ?? "Delete failed.");
      }
      setLocations((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <LocationToolbar
        search={search}
        onSearchChange={setSearch}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
        onAdd={openAdd}
        totalCount={locations.length}
        displayedCount={displayed.length}
      />

      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <LocationTable
          locations={displayed}
          onEdit={openEdit}
          onDelete={handleDelete}
          deleteConfirmId={deleteConfirmId}
          setDeleteConfirmId={setDeleteConfirmId}
          deletingId={deletingId}
          sortField={sortField}
          sortDir={sortDir}
          onSort={toggleSort}
        />
      </Card>

      <LocationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSave}
        isSaving={saving}
        error={formError}
        editingId={editingId}
      />
    </div>
  );
}
