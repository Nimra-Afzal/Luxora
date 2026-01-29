"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const primary = product.primaryImage;
  const secondary = product.images?.[1];

  return (
    <article
      onClick={() => router.push(`/products/${product.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition hover:shadow-lg cursor-pointer w-[260px]"
    >
      {/* Out of stock badge */}
      {product.stock === 0 && (
        <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs px-2 py-1 rounded">
          Out of stock
        </span>
      )}

      {/* Image */}
      <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {primary ? (
          <img
            src={hovered && secondary ? secondary : primary}
            alt={product.name}
            className="w-full h-full object-contain transition-all duration-300"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold line-clamp-1">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-1 flex items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className="text-gray-400 line-through text-sm">
                ${product.price}
              </span>
              <span className="text-blue-600 font-semibold">
                ${product.discountPrice}
              </span>
            </>
          ) : (
            <span className="font-semibold">${product.price}</span>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-1 italic">
          {product.category?.name}
        </p>

        <button
          className="mt-3 w-full text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          View Details
        </button>
      </div>
    </article>
  );
}
