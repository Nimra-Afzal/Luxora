"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Category {
  _id: string;
  name: string;
  parent: string | null;
}

export default function AddProductDialog({
  open,
  setOpen,
  product,
  onSuccess,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  product: any | null;
  onSuccess: () => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [parent, setParent] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [stock, setStock] = useState<number | "">("");

  /* ---------------- IMAGE STATES ---------------- */
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD CATEGORIES ---------------- */
  useEffect(() => {
    api.get("/categories/public").then((res) => setCategories(res.data));
  }, []);

  /* ---------------- PREFILL (EDIT MODE) ---------------- */
  useEffect(() => {
    if (!open) return;

    if (product) {
      setParent(product.category?.parent || "");
      setSubcategory(product.category?._id || "");
      setStock(product.stock ?? "");
      setStatus(product.stock === 0 ? "inactive" : product.status);
      setExistingImage(product.primaryImage || null);
      setRemoveExistingImage(false);
      setImages([]);
      setPreviews([]);
    } else {
      setParent("");
      setSubcategory("");
      setStock("");
      setStatus("active");
      setExistingImage(null);
      setRemoveExistingImage(false);
      setImages([]);
      setPreviews([]);
    }
  }, [open, product]);

  /* ---------------- AUTO STATUS LOGIC ---------------- */
  useEffect(() => {
    if (stock === 0) setStatus("inactive");
  }, [stock]);

  /* ---------------- IMAGE HANDLER ---------------- */
  function handleImages(files: FileList | null) {
    if (!files) return;

    const selected = Array.from(files);
    setImages((prev) => [...prev, ...selected]);
    setPreviews((prev) => [
      ...prev,
      ...selected.map((f) => URL.createObjectURL(f)),
    ]);
  }

  function removeNewImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  /* ---------------- SUBMIT ---------------- */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!subcategory) {
      setError("Please select a subcategory");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("category", subcategory);
    formData.append("status", stock === 0 ? "inactive" : status);
    formData.append("stock", String(stock === "" ? 0 : stock));

    if (removeExistingImage) {
      formData.append("removeImage", "true");
    }

    images.forEach((img) => formData.append("images", img));

    try {
      if (product) {
        await api.put(`/products/${product._id}`, formData);
      } else {
        await api.post("/products", formData);
      }

      setOpen(false);
      onSuccess();
    } catch {
      setError("Failed to save product");
    } finally {
      setLoading(false);
    }
  }

  const parents = categories.filter((c) => !c.parent);
  const subs = categories.filter((c) => c.parent === parent);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <input
            name="name"
            defaultValue={product?.name || ""}
            placeholder="Product name"
            required
            className="w-full border p-2 rounded"
          />

          <textarea
            name="description"
            defaultValue={product?.description || ""}
            placeholder="Description"
            className="w-full border p-2 rounded"
          />

          <input
            name="price"
            type="number"
            defaultValue={product?.price || ""}
            placeholder="Price"
            required
            className="w-full border p-2 rounded"
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              min={0}
              value={stock}
              onChange={(e) =>
                setStock(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <select
            value={status}
            disabled={stock === 0}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full border p-2 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={parent}
            onChange={(e) => setParent(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Parent Category</option>
            {parents.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="w-full border p-2 rounded"
            required
            disabled={!parent}
          >
            <option value="">Select Subcategory</option>
            {subs.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* EXISTING IMAGE */}
          {existingImage && !removeExistingImage && (
            <div>
              <p className="text-xs mb-1">Current image</p>
              <img
                src={existingImage}
                className="h-20 w-20 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => setRemoveExistingImage(true)}
                className="text-xs text-red-600 mt-1"
              >
                Remove image
              </button>
            </div>
          )}

          {/* UPLOAD NEW IMAGES */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImages(e.target.files)}
          />

          {/* PREVIEW NEW IMAGES */}
          {previews.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    className="h-20 w-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button disabled={loading} className="w-full">
            {loading
              ? product
                ? "Updating..."
                : "Creating..."
              : product
              ? "Update Product"
              : "Create Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

