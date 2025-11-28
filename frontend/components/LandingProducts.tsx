"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const parentCategories = [
  {
    name: "Women",
    slug: "women",
    description: "Trendy fashion and accessories for women.",
    image: "/images/categories/women.jpg",
  },
  {
    name: "Men",
    slug: "men",
    description: "Modern and stylish outfits for men.",
    image: "/images/categories/men.jpg",
  },
  {
    name: "Kids",
    slug: "kids",
    description: "Fun, colorful, and comfy wear for kids.",
    image: "/images/categories/kids.jpg",
  },
];

export default function LandingProducts() {
  const router = useRouter();
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <section
      id="categories"
      className={`py-16 transition-colors duration-300 border-b ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-slate-100 border-gray-200"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2
          className={`text-4xl font-bold text-center mb-12 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {parentCategories.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => router.push(`/category-parent/${cat.slug}`)}
              className="relative cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              {/* Background image */}
              <div className="w-full h-64">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {cat.name}
                </h3>
                <p className="text-gray-200 text-sm">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
