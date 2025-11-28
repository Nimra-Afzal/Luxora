"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: { name: string; _id: string };
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        setProduct(res.data);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading product...</p>;
  if (error)
    return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!product)
    return <p className="p-6 text-center text-gray-500">Product not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex flex-wrap gap-1">
        <span
          className="cursor-pointer hover:underline"
          onClick={() => router.push("/")}
        >
          Home
        </span>
        <span>/</span>
        <span
          className="cursor-pointer hover:underline"
          onClick={() => router.push("/?from=detail")}
        >
          Products
        </span>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-200">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Product Image */}
        <div className="flex-1 flex justify-center items-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-md h-auto object-contain rounded shadow"
            />
          ) : (
            <div className="w-full max-w-md h-80 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded">
              No Image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
              {product.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line">
              {product.description || "No description available"}
            </p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              ${Number(product.price).toFixed(2)}
            </p>
            {product.category && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-6">
                Category: {product.category.name}
              </p>
            )}
          </div>

          {/* Back to Products Button */}
          <button
            onClick={() => router.push("/?from=detail")}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}
