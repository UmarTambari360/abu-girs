"use client";

import { useState, useCallback } from "react";
import type { Location } from "@/db/schema";
import { CATEGORIES } from "@/lib/validators/location";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Search,
  ChevronUp,
  ChevronDown,
  TriangleAlert,
} from "lucide-react";

type SortField = "name" | "category" | "created_at";
type SortDir = "asc" | "desc";

type FormData = {
  name: string;
  category: Location["category"];
  description: string;
  address: string;
  latitude: string;
  longitude: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  category: "academic",
  description: "",
  address: "",
  latitude: "",
  longitude: "",
};

const CATEGORY_COLORS: Record<string, string> = {
  academic: "bg-blue-50 text-blue-700 border-blue-200",
  administrative: "bg-purple-50 text-purple-700 border-purple-200",
  health: "bg-red-50 text-red-700 border-red-200",
  accommodation: "bg-orange-50 text-orange-700 border-orange-200",
  recreation: "bg-teal-50 text-teal-700 border-teal-200",
  worship: "bg-yellow-50 text-yellow-700 border-yellow-200",
  transport: "bg-cyan-50 text-cyan-700 border-cyan-200",
  food: "bg-amber-50 text-amber-700 border-amber-200",
  security: "bg-gray-100 text-gray-700 border-gray-300",
  other: "bg-slate-50 text-slate-600 border-slate-200",
};

export default function AdminLocationsClient({
  initialLocations,
}: {
  initialLocations: Location[];
}) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
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

  const handleField = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  // ── Sort icon helper ──────────────────────────────────────────
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ChevronUp className="w-3 h-3 text-gray-300" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-green-700" />
    ) : (
      <ChevronDown className="w-3 h-3 text-green-700" />
    );
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          {/* Add button */}
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Location
          </button>
        </div>

        {/* Result count */}
        <p className="text-xs text-gray-400 mt-2">
          Showing {displayed.length} of {locations.length} locations
        </p>
      </div>

      {/* Slide-in form panel */}
      {formOpen && (
        <div className="bg-white rounded-xl border border-green-200 shadow-md p-6 ring-1 ring-green-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              {editingId !== null ? "Edit Location" : "Add New Location"}
            </h2>
            <button
              onClick={closeForm}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {formError && (
            <div className="flex items-start gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm">
              <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0" />
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleField}
                placeholder="e.g. Faculty of Science"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleField}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Address
              </label>
              <input
                name="address"
                value={formData.address}
                onChange={handleField}
                placeholder="e.g. Main Campus, Zaria"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Latitude <span className="text-red-500">*</span>
              </label>
              <input
                name="latitude"
                value={formData.latitude}
                onChange={handleField}
                type="number"
                step="any"
                placeholder="e.g. 11.1572"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Longitude <span className="text-red-500">*</span>
              </label>
              <input
                name="longitude"
                value={formData.longitude}
                onChange={handleField}
                type="number"
                step="any"
                placeholder="e.g. 7.6369"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleField}
                rows={3}
                placeholder="Brief description of this location…"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={closeForm}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingId !== null ? "Save Changes" : "Create Location"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <MapPin className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              No locations found
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Try a different search or add a new location.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <button
                      onClick={() => toggleSort("name")}
                      className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                    >
                      Name <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <button
                      onClick={() => toggleSort("category")}
                      className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                    >
                      Category <SortIcon field="category" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                    Description
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                    Coordinates
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayed.map((loc) => (
                  <tr
                    key={loc.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-green-700" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">
                          {loc.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${CATEGORY_COLORS[loc.category] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
                      >
                        {loc.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="text-gray-500 text-xs max-w-xs truncate">
                        {loc.description ?? (
                          <span className="text-gray-300 italic">
                            No description
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-gray-400 font-mono">
                        {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit */}
                        <button
                          onClick={() => openEdit(loc)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-green-700 hover:bg-green-50 transition-colors"
                          aria-label={`Edit ${loc.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Delete — confirm in-row */}
                        {deleteConfirmId === loc.id ? (
                          <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                            <span className="text-xs text-red-700 whitespace-nowrap">
                              Delete?
                            </span>
                            <button
                              onClick={() => handleDelete(loc.id)}
                              disabled={deletingId === loc.id}
                              className="text-xs font-semibold text-red-700 hover:text-red-900 transition-colors"
                            >
                              {deletingId === loc.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                "Yes"
                              )}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(loc.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            aria-label={`Delete ${loc.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
