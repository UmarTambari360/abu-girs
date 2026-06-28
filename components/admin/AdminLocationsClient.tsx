"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import type { Location } from "@/types";
import { CATEGORIES } from "@/lib/validators/location";

const CATEGORY_LABELS: Record<string, string> = {
  academic: "Academic",
  administrative: "Administrative",
  health: "Health",
  accommodation: "Accommodation",
  recreation: "Recreation",
  worship: "Worship",
  transport: "Transport",
  food: "Food",
  security: "Security",
  other: "Other",
};

interface Props {
  initialLocations: Location[];
}

const EMPTY_FORM = {
  name: "",
  category: "other" as Location["category"],
  description: "",
  address: "",
  latitude: "",
  longitude: "",
};

export default function AdminLocationsClient({ initialLocations }: Props) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function openEdit(loc: Location) {
    setForm({
      name: loc.name,
      category: loc.category,
      description: loc.description ?? "",
      address: loc.address ?? "",
      latitude: String(loc.latitude),
      longitude: String(loc.longitude),
    });
    setEditingId(loc.id);
    setShowForm(true);
    setError("");
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const body = {
      ...form,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
    };

    const url = editingId
      ? `/api/admin/locations?id=${editingId}`
      : "/api/admin/locations";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error?.formErrors?.[0] ?? "Save failed");
      setSaving(false);
      return;
    }

    if (editingId) {
      setLocations((prev) =>
        prev.map((l) => (l.id === editingId ? json.data : l))
      );
    } else {
      setLocations((prev) => [...prev, json.data]);
    }
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this location?")) return;
    const res = await fetch(`/api/admin/locations?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setLocations((prev) => prev.filter((l) => l.id !== id));
    }
  }

  return (
    <div className="space-y-4">
      {/* Add button */}
      {!showForm && (
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
        >
          <Plus size={16} />
          Add Location
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              {editingId ? "Edit Location" : "New Location"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Name *
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Faculty of Engineering"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Category *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as Location["category"],
                  })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Address
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="e.g. Main Campus, ABU Zaria"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Latitude *
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                value={form.latitude}
                onChange={(e) =>
                  setForm({ ...form, latitude: e.target.value })
                }
                placeholder="11.1572"
                type="number"
                step="any"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Longitude *
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                value={form.longitude}
                onChange={(e) =>
                  setForm({ ...form, longitude: e.target.value })
                }
                placeholder="7.6369"
                type="number"
                step="any"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Brief description of this location"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-60"
            >
              <Check size={14} />
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Category
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                Coordinates
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {locations.map((loc) => (
              <tr key={loc.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {loc.name}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full capitalize">
                    {loc.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                  {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => openEdit(loc)}
                      className="text-gray-400 hover:text-gray-700 p-1"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(loc.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {locations.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No locations yet. Add one above.
          </div>
        )}
      </div>
    </div>
  );
}
