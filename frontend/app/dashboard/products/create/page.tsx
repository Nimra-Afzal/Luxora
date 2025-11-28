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

export default function CreateProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("/categories/public");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedSubcategory("");
  }, [selectedParent]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Only send subcategory id as category (we require subcategory selection)
    formData.append("category", selectedSubcategory);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Product created!");
      router.push("/dashboard/products");
    } catch (err) {
      console.error("Error creating product:", err);
      alert("❌ Failed to create product");
    }
  };

  const parentCategories = categories.filter((c) => !c.parent);
  const subcategories = categories.filter((c) => c.parent === selectedParent);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg bg-white dark:bg-gray-800 p-6 rounded shadow">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Product Name</label>
          <input type="text" name="name" required className="w-full px-3 py-2 border rounded" />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea name="description" required rows={4} className="w-full px-3 py-2 border rounded" />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
          <input type="number" name="price" required step="0.01" min="0" className="w-full px-3 py-2 border rounded" />
        </div>

        {/* Parent Category */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Parent Category</label>
          <select value={selectedParent} onChange={(e) => setSelectedParent(e.target.value)} required className="w-full px-3 py-2 border rounded">
            <option value="">Select Parent Category</option>
          {parentCategories.map((c) => (
  <option key={c._id} value={c._id}>
    {c.name}
  </option>
))}

          </select>
        </div>

        {/* Subcategory */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Subcategory</label>
          <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)} required disabled={!selectedParent} className="w-full px-3 py-2 border rounded disabled:opacity-50">
            <option value="">Select Subcategory</option>
            {subcategories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Product Image</label>
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setSelectedImage(file);
            setPreviewImage(file ? URL.createObjectURL(file) : null);
          }} className="w-full px-3 py-2 border rounded" />
          {previewImage && <img src={previewImage} alt="Preview" className="w-48 h-48 object-cover border rounded mt-2" />}
        </div>

        <button type="submit" disabled={!selectedParent || !selectedSubcategory} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Create Product</button>
      </form>
    </div>
  );
}
