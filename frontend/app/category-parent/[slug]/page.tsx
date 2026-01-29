"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

interface Product {
  _id: string;
  name: string;
  price: number;
  primaryImage?: string;
  category: {
    name: string;
    slug: string;
  };
}

export default function CategoryParentPage() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get(`/products/parent/${slug}`);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProducts();
    }
  }, [slug]);

  return (
    <div className="p-6">
      {/* ✅ BREADCRUMB */}
      <Breadcrumb slug={slug as string} />

      {loading ? (
        // 🔹 SHOW SKELETONS WHILE LOADING
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        // 🔹 NO PRODUCTS
        <p className="text-center text-gray-500 mt-6">
          No products found in this category.
        </p>
      ) : (
        // 🔹 PRODUCTS GRID
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

