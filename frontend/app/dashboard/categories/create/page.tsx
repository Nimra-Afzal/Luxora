"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  parent: string | null;
}

export default function CreateCategoryPage() {
  const router = useRouter();

  // Parent category state
  const [parentName, setParentName] = useState("");

  // Subcategory state
  const [subName, setSubName] = useState("");
  const [parents, setParents] = useState<Category[]>([]);
  const [selectedParent, setSelectedParent] = useState("");

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      // public endpoint returns all categories
      const res = await api.get("/categories/public");
      const parentCats = res.data.filter((c: Category) => !c.parent);
      setParents(parentCats);
    } catch (err) {
      console.error("Error fetching parent categories:", err);
    }
  };

  // Add Parent Category
  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim()) return;

    try {
      await api.post("/categories", { name: parentName.trim() });
      alert("✅ Parent category created!");
      setParentName("");
      fetchParents();
    } catch (err: any) {
      console.error("Error creating parent category:", err);
      alert(err.response?.data?.error || "❌ Failed to create parent category");
    }
  };

  // Add Subcategory
  const handleSubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !selectedParent) return;

    try {
      await api.post("/categories", { name: subName.trim(), parent: selectedParent });
      alert("✅ Subcategory created!");
      setSubName("");
      setSelectedParent("");
      fetchParents();
    } catch (err: any) {
      console.error("Error creating subcategory:", err);
      alert(err.response?.data?.error || "❌ Failed to create subcategory");
    }
  };

  return (
    <div className="p-6 space-y-12">
      {/* Parent Category */}
      <div>
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add Parent Category</h1>
        <form onSubmit={handleParentSubmit} className="max-w-lg space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Parent Category Name</label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="e.g., Women, Men, Kids"
              required
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={!parentName.trim()}
          >
            Save Parent Category
          </button>
        </form>
      </div>

      {/* Subcategory */}
      <div>
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add Subcategory</h1>
        <form onSubmit={handleSubSubmit} className="max-w-lg space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Select Parent Category</label>
            <select
              value={selectedParent}
              onChange={(e) => setSelectedParent(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            >
              <option value="">Choose Parent Category</option>
              {parents.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Subcategory Name</label>
            <input
              type="text"
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              placeholder="e.g., Shirts, Dresses, Shoes"
              required
              disabled={!selectedParent}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            disabled={!subName.trim() || !selectedParent}
          >
            Save Subcategory
          </button>
        </form>
      </div>
    </div>
  );
}
