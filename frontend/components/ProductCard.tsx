"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: any }) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/products/${product._id}`);
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition hover:shadow-lg flex flex-col">
      {/* Image */}
      <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
            {product.name}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ${Number(product.price ?? 0).toFixed(2)}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm line-clamp-2">
          {product.description ?? "No description"}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-gray-500 italic line-clamp-1">
            {product.category?.name ?? ""}
          </div>
          <button
            onClick={handleView}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
