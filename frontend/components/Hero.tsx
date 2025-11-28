"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { ShoppingBag, ShoppingCart, Tag } from "lucide-react"

export default function Hero() {
  const theme = useSelector((state: RootState) => state.theme.mode)

  return (
    <section
      className={`relative py-28 transition-colors duration-300 border-b overflow-hidden ${
        theme === "dark"
          ? "bg-gray-900 border-gray-700"
          : "bg-gradient-to-br from-pink-200 via-purple-200 to-blue-300"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 text-center relative z-10">
        {/* Headline */}
        <h1
          className={`text-5xl md:text-7xl font-extrabold mb-6 leading-tight ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Your One-Stop Shop for{" "}
          <span
            className={`${
              theme === "dark" ? "text-blue-400" : "text-blue-700"
            }`}
          >
            Style & Savings
          </span>
        </h1>

        {/* Subtext */}
        <p
          className={`text-xl mb-10 max-w-3xl mx-auto leading-relaxed ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Discover the latest trends, unbeatable deals, and everything you need
          for fashion, lifestyle, and more — all in one place.
        </p>
      </div>

      {/* Decorative shopping icons */}
      <ShoppingBag
        className="absolute top-12 left-16 w-16 h-16 text-pink-500 opacity-60 animate-bounce"
      />
      <ShoppingCart
        className="absolute bottom-16 right-24 w-20 h-20 text-blue-600 opacity-60 animate-pulse"
      />
      <Tag
        className="absolute top-1/3 right-1/4 w-14 h-14 text-purple-500 opacity-60 animate-spin-slow"
      />
    </section>
  )
}
