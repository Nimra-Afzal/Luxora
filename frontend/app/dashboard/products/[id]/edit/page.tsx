"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  parent: string | null;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  category: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get("/categories/public"),
          api.get(`/products/${productId}`),
        ]);

        const categoriesData = catRes.data;
        setCategories(categoriesData);

        const prod = prodRes.data.product || prodRes.data;
        setProduct(prod);

        // Build preview image absolute URL if necessary
        const base = api.defaults.baseURL ? api.defaults.baseURL.replace("/api/v1", "") : "http://localhost:5000";
        setPreviewImage(prod.image ? (prod.image.startsWith("http") ? prod.image : `${base}${prod.image}`) : null);

        // find product's category object
        const prodCategory = categoriesData.find((c: Category) => c._id === prod.category);
        if (prodCategory) {
          if (prodCategory.parent) {
            setSelectedParent(prodCategory.parent);
            setSelectedSubcategory(prodCategory._id);
          } else {
            setSelectedParent(prodCategory._id);
            setSelectedSubcategory(""); // no sub
          }
        }
      } catch (err) {
        console.error("Error loading product or categories:", err);
        alert("❌ Failed to load product or categories");
      } finally {
        setLoading(false);
      }
    }
    if (productId) fetchData();
  }, [productId]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product) return;

    const formData = new FormData();
    formData.append("name", (e.currentTarget.elements.namedItem("name") as HTMLInputElement).value);
    formData.append("description", (e.currentTarget.elements.namedItem("description") as HTMLTextAreaElement).value);
    formData.append("price", (e.currentTarget.elements.namedItem("price") as HTMLInputElement).value);
    formData.append("category", selectedSubcategory || selectedParent);

    if (newImage) formData.append("image", newImage);

    try {
      await api.put(`/products/${productId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("✅ Product updated!");
      router.push("/dashboard/products");
    } catch (err) {
      console.error("Error updating product:", err);
      alert("❌ Failed to update product");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found</p>;

  const parentCategories = categories.filter((c) => !c.parent);
  const subcategories = categories.filter((c) => c.parent === selectedParent);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input type="text" name="name" required defaultValue={product.name} className="w-full px-3 py-2 border rounded" />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea name="description" required rows={4} defaultValue={product.description ?? ""} className="w-full px-3 py-2 border rounded" />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input type="number" name="price" required step="0.01" defaultValue={product.price} className="w-full px-3 py-2 border rounded" />
        </div>

        {/* Parent Category */}
        <div>
          <label className="block mb-1 font-medium">Parent Category</label>
          <select value={selectedParent} onChange={(e) => setSelectedParent(e.target.value)} required className="w-full px-3 py-2 border rounded">
            <option value="">Select Parent Category</option>
            {parentCategories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
          </select>
        </div>

        {/* Subcategory */}
        <div>
          <label className="block mb-1 font-medium">Subcategory</label>
          <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)} disabled={!selectedParent} className="w-full px-3 py-2 border rounded disabled:opacity-50">
            <option value="">Select Subcategory</option>
            {subcategories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
          </select>
        </div>

        {/* Image Preview */}
        <div>
          <label className="block mb-1 font-medium">Image Preview</label>
          {previewImage ? (
            <img src={previewImage} alt="Preview" className="w-48 h-48 object-contain border rounded mb-2" />
          ) : (
            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center mb-2 rounded">No Image</div>
          )}
        </div>

        {/* Replace Image */}
        <div>
          <label className="block mb-1 font-medium">Replace Image (optional)</label>
          <input type="file" accept="image/*" className="w-full" onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setNewImage(file);
            if (file) setPreviewImage(URL.createObjectURL(file));
          }} />
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update Product</button>
      </form>
    </div>
  );
}
