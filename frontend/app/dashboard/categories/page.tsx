"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import CategoryFormModal from "@/components/CategoryFormModal";

interface Category {
  _id: string;
  name: string;
  status?: string;
  parent?: {
    _id: string;
    name: string;
    slug?: string;
  } | null;
}

export default function CategoriesListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  async function fetchCategories() {
    try {
      const res = await api.get("/categories/admin");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      alert("❌ Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      alert("✅ Category deleted");
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("❌ Failed to delete category");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>

        <button
          onClick={() => {
            setEditingCategory(null); // ➕ CREATE
            setOpenModal(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Category
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Parent</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => {
                const isParent = !category.parent;

                return (
                  <tr
                    key={category._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">{category.name}</td>

                    <td className="p-3">
                      {isParent ? "Parent" : "Subcategory"}
                    </td>

                    <td className="p-3">
                      {isParent ? "—" : category.parent!.name}
                    </td>

                    <td className="p-3">
                      {category.status || "active"}
                    </td>

                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingCategory(category); // ✏️ EDIT
                          setOpenModal(true);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(category._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <CategoryFormModal
        open={openModal}
        category={editingCategory}
        onClose={() => {
          setOpenModal(false);
          setEditingCategory(null);
        }}
        onSuccess={async () => {
          setOpenModal(false);
          setEditingCategory(null);
          setLoading(true);
          await fetchCategories();
        }}
      />
    </div>
  );
}

