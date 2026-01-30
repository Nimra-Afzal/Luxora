"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import api from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories?: Category[];
}

// Category color schemes
const categoryColors = [
  { bg: "from-blue-500 to-blue-600", light: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
  { bg: "from-purple-500 to-purple-600", light: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
  { bg: "from-pink-500 to-pink-600", light: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-600 dark:text-pink-400" },
  { bg: "from-orange-500 to-orange-600", light: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
  { bg: "from-green-500 to-green-600", light: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" },
  { bg: "from-teal-500 to-teal-600", light: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-600 dark:text-teal-400" },
];

export default function Features() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/public/tree");
        setCategories(res.data || []);
      } catch (error) {
        console.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
            <Layers size={16} />
            Browse by Category
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Categories
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our wide range of products organized by categories. Find exactly what you&apos;re looking for with ease.
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <>
            {/* Main Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {categories.slice(0, 6).map((category, index) => {
                const colorScheme = categoryColors[index % categoryColors.length];
                return (
                  <Link
                    key={category._id}
                    href={`/products?category=${category.slug}`}
                    className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.bg} opacity-90 group-hover:opacity-100 transition-opacity`} />

                    {/* Content */}
                    <div className="relative h-full flex flex-col items-center justify-center p-4 text-white">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <span className="text-2xl font-bold">{category.name.charAt(0)}</span>
                      </div>
                      <h3 className="font-semibold text-center text-sm md:text-base">{category.name}</h3>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <p className="text-xs text-white/80 mt-1">
                          {category.subcategories.length} subcategories
                        </p>
                      )}
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={16} className="text-white" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Subcategories Preview */}
            {categories.some(cat => cat.subcategories && cat.subcategories.length > 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Popular Subcategories
                </h3>
                <div className="flex flex-wrap gap-3">
                  {categories
                    .flatMap(cat => cat.subcategories || [])
                    .slice(0, 12)
                    .map((subcat, index) => {
                      const colorScheme = categoryColors[index % categoryColors.length];
                      return (
                        <Link
                          key={subcat._id}
                          href={`/products?category=${subcat.slug}`}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colorScheme.light} ${colorScheme.text} hover:opacity-80 transition-opacity text-sm font-medium`}
                        >
                          {subcat.name}
                        </Link>
                      );
                    })}
                </div>
              </div>
            )}

            {/* View All Link */}
            <div className="text-center mt-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                View All Products
                <ArrowRight size={18} />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Layers size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">No categories available at the moment</p>
          </div>
        )}
      </div>
    </section>
  );
}
