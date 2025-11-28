"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Category {
  _id: string;
  name: string;
}

export default function CategoriesListPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("/categories"); // admin route
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        alert("❌ Failed to load categories");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Delete category
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
      alert("✅ Category deleted");
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("❌ Failed to delete category");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <button
        onClick={() => router.push("/dashboard/categories/create")}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Add Category
      </button>

      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="border rounded-lg shadow p-4 flex flex-col justify-between"
            >
              <h2 className="text-lg font-semibold truncate">{category.name}</h2>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => router.push(`/dashboard/categories/${category._id}/edit`)}
                  className="flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(category._id)}
                  className="flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
