"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Sparkles, Truck, Shield, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Main Hero Content */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500" />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm mb-6">
                <Sparkles size={16} className="text-yellow-400" />
                <span>New Season Collection Available</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Discover Your
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Perfect Style
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                Explore thousands of premium products from top brands. Find everything you need with exclusive deals and free shipping on orders over $50.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative max-w-md mx-auto lg:mx-0 mb-8">
                <Input
                  type="text"
                  placeholder="Search for products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-32 rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-purple-400 transition-all"
                />
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Search
                </Button>
              </form>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-gray-900 hover:bg-gray-100 font-semibold">
                    Shop Now
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link href="/products?featured=true">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-12 px-8 rounded-full border-2 border-white bg-transparent text-white hover:bg-white hover:text-gray-900 font-semibold transition-all"
                  >
                    View Deals
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-8 mt-10 pt-10 border-t border-white/10">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">10K+</p>
                  <p className="text-sm text-gray-400">Products</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">50K+</p>
                  <p className="text-sm text-gray-400">Happy Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">100+</p>
                  <p className="text-sm text-gray-400">Top Brands</p>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative hidden lg:block">
              {/* Floating Card - Top Right */}
              <div className="absolute -top-4 right-8 z-20 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Order Placed!</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">2 mins ago</p>
                  </div>
                </div>
              </div>

              {/* Main Image Container */}
              <div className="relative z-10">
                <div className="relative aspect-square max-w-lg mx-auto">
                  <Image
                    src="/images.png"
                    alt="Hero Image"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Floating Card - Bottom Left */}
              <div className="absolute bottom-8 -left-4 z-20 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500" />
                    <div className="w-8 h-8 rounded-full bg-purple-500" />
                    <div className="w-8 h-8 rounded-full bg-pink-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">+2.5K</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Shopping now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Strip */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <Truck size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Free Shipping</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Shield size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Secure Payment</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">100% protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <RefreshCcw size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Easy Returns</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <Sparkles size={24} className="text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Best Quality</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Curated products</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
