"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  parent?: {
    _id: string;
  } | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Category | null; // ✅ NEW (for edit)
}

export default function CategoryFormModal({
  open,
  onClose,
  onSuccess,
  category, // ✅ NEW
}: Props) {
  const [name, setName] = useState("");
  const [parent, setParent] = useState<string>("");
  const [allParents, setAllParents] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * 🔹 Fetch parent categories (ONLY real parents)
   */
  useEffect(() => {
    if (!open) return;

    async function fetchParents() {
      try {
        const res = await api.get("/categories/admin");

        console.log("ADMIN CATEGORIES:", res.data);

        const parentCategories = res.data.filter(
          (c: Category) => c.parent === null
        );

        setAllParents(parentCategories);
      } catch (err) {
        console.error("Failed to load parent categories", err);
      }
    }

    fetchParents();
  }, [open]);

  /**
   * 🔹 Prefill form in EDIT mode
   */
  useEffect(() => {
    if (!open) return;

    if (category) {
      setName(category.name);
      setParent(category.parent?._id || "");
    } else {
      setName("");
      setParent("");
    }
  }, [open, category]);

  /**
   * 🔹 Create / Update submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      setLoading(true);

      if (category) {
        // ✏️ EDIT
        await api.put(`/categories/${category._id}`, {
          name,
          parent: parent || null,
        });
      } else {
        // ➕ CREATE
        await api.post("/categories", {
          name,
          parent: parent || null,
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          {category ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Shoes"
            />
          </div>

          {/* Parent Category */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Parent Category (optional)
            </label>

            <select
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">— No parent (Parent category)</option>

              {allParents.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <p className="text-xs text-gray-500 mt-1">
              Leave empty to create a parent category
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : category
                ? "Update"
                : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
