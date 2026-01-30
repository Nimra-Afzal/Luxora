"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getParentCategories,
  getSubcategories,
  clearSubcategories,
} from "@/redux/features/categorySlice";
import api from "@/lib/api";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  category: {
    _id: string;
    name: string;
    parent?: {
      _id: string;
      name: string;
    } | null;
  };
  images?: string[];
  primaryImage?: string;
}

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  product: Product | null;
  onSuccess: () => void;
}

export default function AddProductDialog({
  open,
  setOpen,
  product,
  onSuccess,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const { parents, subcategories, parentsLoading, subcategoriesLoading } =
    useSelector((state: RootState) => state.categories);

  const [parentId, setParentId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [stock, setStock] = useState<number | "">(0);

  // Image states
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch parent categories on mount
  useEffect(() => {
    if (open) {
      dispatch(getParentCategories());
    }
  }, [open, dispatch]);

  // Fetch subcategories when parent changes
  useEffect(() => {
    if (parentId) {
      dispatch(getSubcategories(parentId));
    } else {
      dispatch(clearSubcategories());
    }
  }, [parentId, dispatch]);

  // Prefill form in edit mode
  useEffect(() => {
    if (!open) return;

    if (product) {
      // Get parent ID from category's parent
      const productParentId = product.category?.parent?._id || "";
      setParentId(productParentId);
      setSubcategoryId(product.category?._id || "");
      setStock(product.stock ?? 0);
      setStatus(product.stock === 0 ? "inactive" : product.status);
      // Load all existing images
      setExistingImages(product.images || []);
      setImagesToRemove([]);
      setImages([]);
      setPreviews([]);

      // Fetch subcategories for the parent
      if (productParentId) {
        dispatch(getSubcategories(productParentId));
      }
    } else {
      // Reset form for create mode
      setParentId("");
      setSubcategoryId("");
      setStock(0);
      setStatus("active");
      setExistingImages([]);
      setImagesToRemove([]);
      setImages([]);
      setPreviews([]);
      dispatch(clearSubcategories());
    }
  }, [open, product, dispatch]);

  // Auto-update status when stock becomes 0
  useEffect(() => {
    if (stock === 0) {
      setStatus("inactive");
    }
  }, [stock]);

  // Clear subcategory when parent changes
  useEffect(() => {
    if (!product || product.category?.parent?._id !== parentId) {
      setSubcategoryId("");
    }
  }, [parentId, product]);

  const handleImages = (files: FileList | null) => {
    if (!files) return;

    const selected = Array.from(files);
    setImages((prev) => [...prev, ...selected]);
    setPreviews((prev) => [
      ...prev,
      ...selected.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!parentId) {
      setError("Please select a parent category");
      return;
    }

    if (!subcategoryId) {
      setError("Please select a subcategory");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("category", subcategoryId);
    formData.append("status", stock === 0 ? "inactive" : status);
    formData.append("stock", String(stock === "" ? 0 : stock));

    // Send list of images to remove
    if (imagesToRemove.length > 0) {
      formData.append("imagesToRemove", JSON.stringify(imagesToRemove));
    }

    // Add new images
    images.forEach((img) => formData.append("images", img));

    try {
      if (product) {
        await api.put(`/products/${product._id}`, formData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await api.post("/products", formData);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      setOpen(false);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              defaultValue={product?.name || ""}
              placeholder="Product name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description || ""}
              placeholder="Product description"
              rows={3}
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.price || ""}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min={0}
                value={stock}
                onChange={(e) =>
                  setStock(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as "active" | "inactive")}
              disabled={stock === 0}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {stock === 0 && (
              <p className="text-xs text-amber-600">
                Product is automatically inactive when stock is 0
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">
              Product Category
            </h3>

            {/* Parent Category */}
            <div className="space-y-2">
              <Label>Parent Category *</Label>
              <Select
                value={parentId}
                onValueChange={setParentId}
                disabled={parentsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category" />
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
              <Label>Subcategory *</Label>
              <Select
                value={subcategoryId}
                onValueChange={setSubcategoryId}
                disabled={!parentId || subcategoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !parentId
                        ? "Select parent category first"
                        : subcategoriesLoading
                        ? "Loading..."
                        : "Select subcategory"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.length === 0 && parentId ? (
                    <div className="px-2 py-4 text-sm text-gray-500 text-center">
                      No subcategories found.
                      <br />
                      Create one in Categories first.
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
              <p className="text-xs text-gray-500">
                Products must be assigned to a subcategory
              </p>
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="space-y-2">
              <Label>Current Images ({existingImages.filter(img => !imagesToRemove.includes(img)).length})</Label>
              <div className="flex gap-2 flex-wrap">
                {existingImages.map((img, index) => (
                  !imagesToRemove.includes(img) && (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Product image ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => setImagesToRemove(prev => [...prev, img])}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                      {index === 0 && !imagesToRemove.includes(existingImages[0]) && (
                        <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  )
                ))}
              </div>
              {imagesToRemove.length > 0 && (
                <p className="text-xs text-amber-600">
                  {imagesToRemove.length} image(s) will be removed on save
                </p>
              )}
            </div>
          )}

          {/* Upload New Images */}
          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImages(e.target.files)}
                className="hidden"
                id="product-images"
              />
              <label htmlFor="product-images" className="cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload images
                </span>
              </label>
            </div>

            {/* Preview New Images */}
            {previews.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative">
                    <img
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="h-20 w-20 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" disabled={loading} className="w-full">
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
