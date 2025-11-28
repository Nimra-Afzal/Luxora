"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  parent: string | null;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [parent, setParent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;

      try {
        const [catRes, categoryRes] = await Promise.all([
          api.get("/categories/public"),
          api.get(`/categories/${categoryId}`),
        ]);

        setCategories(catRes.data);
        const categoryData = categoryRes.data.category;
        setName(categoryData.name);
        setParent(categoryData.parent ?? null);
      } catch (err: any) {
        console.error("Error loading category:", err);
        alert("❌ Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return alert("Category name cannot be empty");

    try {
      await api.put(`/categories/${categoryId}`, { name, parent });
      alert("✅ Category updated!");
      router.push("/dashboard/categories");
    } catch (err) {
      console.error("Error updating category:", err);
      alert("❌ Failed to update category");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  const parentOptions = categories.filter((c) => c._id !== categoryId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Parent Category</label>
          <select
            value={parent ?? ""}
            onChange={(e) => setParent(e.target.value || null)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">None (Top Level)</option>
            {parentOptions.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Category
        </button>
      </form>
    </div>
  );
}
