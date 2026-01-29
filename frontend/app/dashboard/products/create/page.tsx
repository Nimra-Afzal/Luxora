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

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const res = await api.get("/categories/public");
      setCategories(res.data);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedSubcategory("");
  }, [selectedParent]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setImages(files);

    const previewUrls = files.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(previewUrls);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.append("category", selectedSubcategory);

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product created!");
      router.push("/dashboard/products");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create product");
    }
  };

  const parentCategories = categories.filter((c) => !c.parent);
  const subcategories = categories.filter((c) => c.parent === selectedParent);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg bg-white p-6 rounded shadow">
        <input name="name" placeholder="Product Name" required className="w-full border p-2 rounded" />
        <textarea name="description" placeholder="Description" required className="w-full border p-2 rounded" />
        <input name="price" type="number" placeholder="Price" required className="w-full border p-2 rounded" />
        <input name="stock" type="number" placeholder="Stock" className="w-full border p-2 rounded" />

        <select value={selectedParent} onChange={(e) => setSelectedParent(e.target.value)} required className="w-full border p-2 rounded">
          <option value="">Select Parent</option>
          {parentCategories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)} required disabled={!selectedParent} className="w-full border p-2 rounded">
          <option value="">Select Subcategory</option>
          {subcategories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        {/* MULTIPLE IMAGE INPUT */}
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />

        {/* PREVIEWS */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <img key={i} src={src} className="h-24 w-full object-cover border rounded" />
            ))}
          </div>
        )}

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Create Product
        </button>
      </form>
    </div>
  );
}

