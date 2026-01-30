"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getParentCategories,
  getSubcategories,
  clearSubcategories,
} from "@/redux/features/categorySlice";
import api from "@/lib/api";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function CreateProductPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const { parents, subcategories, parentsLoading, subcategoriesLoading } =
    useSelector((state: RootState) => state.categories);

  const [selectedParent, setSelectedParent] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [stock, setStock] = useState<number | "">(0);

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch parent categories on mount
  useEffect(() => {
    dispatch(getParentCategories());
  }, [dispatch]);

  // Fetch subcategories when parent changes
  useEffect(() => {
    if (selectedParent) {
      dispatch(getSubcategories(selectedParent));
      setSelectedSubcategory(""); // Reset subcategory when parent changes
    } else {
      dispatch(clearSubcategories());
    }
  }, [selectedParent, dispatch]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!selectedParent) {
      setError("Please select a parent category");
      return;
    }

    if (!selectedSubcategory) {
      setError("Please select a subcategory");
      return;
    }

    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.append("category", selectedSubcategory);
    formData.append("stock", String(stock === "" ? 0 : stock));
    formData.append("status", stock === 0 ? "inactive" : "active");

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      router.push("/dashboard/products");
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <header className="mb-8">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          Add New Product
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Fill in the details to create a new product
        </p>
      </header>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              rows={4}
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) =>
                  setStock(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="0"
              />
              {stock === 0 && (
                <p className="text-xs text-amber-600">
                  Product will be inactive with 0 stock
                </p>
              )}
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">
              Product Category *
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Parent Category */}
              <div className="space-y-2">
                <Label>Parent Category</Label>
                <Select
                  value={selectedParent}
                  onValueChange={setSelectedParent}
                  disabled={parentsLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        parentsLoading ? "Loading..." : "Select parent category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {parents.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory */}
              <div className="space-y-2">
                <Label>Subcategory</Label>
                <Select
                  value={selectedSubcategory}
                  onValueChange={setSelectedSubcategory}
                  disabled={!selectedParent || subcategoriesLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !selectedParent
                          ? "Select parent first"
                          : subcategoriesLoading
                          ? "Loading..."
                          : "Select subcategory"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.length === 0 && selectedParent ? (
                      <div className="px-2 py-4 text-sm text-gray-500 text-center">
                        No subcategories found.
                        <br />
                        <Link
                          href="/dashboard/categories"
                          className="text-blue-600 hover:underline"
                        >
                          Create one in Categories
                        </Link>
                      </div>
                    ) : (
                      subcategories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Products must be assigned to a subcategory for proper
              organization
            </p>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload images
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG up to 5MB each
                </span>
              </label>
            </div>

            {/* Image Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="h-24 w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={submitting || !selectedSubcategory}
              className="flex-1"
            >
              {submitting ? "Creating..." : "Create Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
