"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  DollarSign,
  Layers,
  BarChart3,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  barcode?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ProductDetailModal({ open, onClose, product }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const images = product.images?.length ? product.images : product.primaryImage ? [product.primaryImage] : [];

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const categoryPath = product.category?.parent
    ? `${product.category.parent.name} / ${product.category.name}`
    : product.category?.name || "Uncategorized";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Product Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="relative">
            {images.length > 0 ? (
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50 hover:bg-white/70"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                <Package size={48} className="text-gray-400" />
              </div>
            )}

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex
                        ? "border-blue-500"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Title & Status */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h2>
              {product.slug && (
                <p className="text-sm text-gray-500 mt-1">/{product.slug}</p>
              )}
            </div>
            <Badge
              variant={product.status === "active" ? "default" : "secondary"}
              className={
                product.status === "active"
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : ""
              }
            >
              {product.status}
            </Badge>
          </div>

          {/* Description */}
          {product.description && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400">
                {product.description}
              </p>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                <DollarSign size={16} />
                <span className="text-xs font-medium uppercase">Price</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div
              className={`rounded-xl p-4 ${
                product.stock > 10
                  ? "bg-green-50 dark:bg-green-900/20"
                  : product.stock > 0
                  ? "bg-yellow-50 dark:bg-yellow-900/20"
                  : "bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div
                className={`flex items-center gap-2 mb-1 ${
                  product.stock > 10
                    ? "text-green-600 dark:text-green-400"
                    : product.stock > 0
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                <BarChart3 size={16} />
                <span className="text-xs font-medium uppercase">Stock</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {product.stock}
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 col-span-2">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                <Layers size={16} />
                <span className="text-xs font-medium uppercase">Category</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {categoryPath}
              </p>
            </div>
          </div>

          {/* Additional Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Additional Information
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {product.sku && (
                <>
                  <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Tag size={14} />
                    SKU
                  </dt>
                  <dd className="text-gray-900 dark:text-white font-medium">
                    {product.sku}
                  </dd>
                </>
              )}
              {product.barcode && (
                <>
                  <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Tag size={14} />
                    Barcode
                  </dt>
                  <dd className="text-gray-900 dark:text-white font-medium">
                    {product.barcode}
                  </dd>
                </>
              )}
              <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Calendar size={14} />
                Created
              </dt>
              <dd className="text-gray-900 dark:text-white">
                {formatDate(product.createdAt)}
              </dd>
              <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Calendar size={14} />
                Updated
              </dt>
              <dd className="text-gray-900 dark:text-white">
                {formatDate(product.updatedAt)}
              </dd>
            </dl>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
