"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronRight,
  X,
  SlidersHorizontal,
  Package,
  Star,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import api from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  images: string[];
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
  stock: number;
  rating?: number;
  reviewCount?: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  subcategories?: Category[];
}

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(searchParams.get("sale") === "true");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products/public"),
          api.get("/categories/public/tree"),
        ]);
        setProducts(productsRes.data?.products || productsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update URL with filters
  const updateUrlParams = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.push(`/products?${newParams.toString()}`, { scroll: false });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(
        (p) => p.category?.slug === selectedCategory
      );
    }

    // Price filter
    result = result.filter(
      (p) => {
        const price = p.salePrice || p.price;
        return price >= priceRange[0] && price <= priceRange[1];
      }
    );

    // Stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sale filter
    if (onSaleOnly) {
      result = result.filter((p) => p.salePrice && p.salePrice < p.price);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "price-high":
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case "popular":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
      default:
        // Assuming newer products are at the beginning
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, inStockOnly, onSaleOnly, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateDiscount = (price: number, salePrice: number) => {
    return Math.round(((price - salePrice) / price) * 100);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("newest");
    setPriceRange([0, 1000]);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setCurrentPage(1);
    router.push("/products");
  };

  const hasActiveFilters = searchQuery || selectedCategory || inStockOnly || onSaleOnly || priceRange[0] > 0 || priceRange[1] < 1000;

  // Find active category name
  const getActiveCategoryName = () => {
    if (!selectedCategory) return null;
    for (const cat of categories) {
      if (cat.slug === selectedCategory) return cat.name;
      for (const sub of cat.subcategories || []) {
        if (sub.slug === selectedCategory) return sub.name;
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 dark:text-white">Products</span>
            {getActiveCategoryName() && (
              <>
                <ChevronRight size={14} />
                <span className="text-gray-900 dark:text-white">{getActiveCategoryName()}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {getActiveCategoryName() || "All Products"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {filteredProducts.length} products found
              </p>
            </div>

            {/* Search & Sort */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative w-64 hidden md:block">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(value) => {
                setSortBy(value);
                updateUrlParams({ sort: value });
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="hidden md:flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                >
                  <Grid size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                >
                  <List size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal size={18} className="mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Active Filters</span>
                    <button
                      onClick={clearFilters}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs">
                        {getActiveCategoryName()}
                        <button onClick={() => {
                          setSelectedCategory("");
                          updateUrlParams({ category: null });
                        }}>
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {inStockOnly && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs">
                        In Stock
                        <button onClick={() => setInStockOnly(false)}>
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {onSaleOnly && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs">
                        On Sale
                        <button onClick={() => setOnSaleOnly(false)}>
                          <X size={12} />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => {
                        setSelectedCategory("");
                        setCurrentPage(1);
                        updateUrlParams({ category: null });
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        !selectedCategory
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      All Products
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category._id}>
                      <div className="flex items-center">
                        <button
                          onClick={() => {
                            setSelectedCategory(category.slug);
                            setCurrentPage(1);
                            updateUrlParams({ category: category.slug });
                          }}
                          className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedCategory === category.slug
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {category.name}
                        </button>
                        {category.subcategories && category.subcategories.length > 0 && (
                          <button
                            onClick={() => toggleCategory(category._id)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <ChevronDown
                              size={16}
                              className={`transition-transform ${
                                expandedCategories.includes(category._id) ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>
                      {category.subcategories && expandedCategories.includes(category._id) && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {category.subcategories.map((sub) => (
                            <li key={sub._id}>
                              <button
                                onClick={() => {
                                  setSelectedCategory(sub.slug);
                                  setCurrentPage(1);
                                  updateUrlParams({ category: sub.slug });
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                  selectedCategory === sub.slug
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                    : "text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                              >
                                {sub.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Price Range</h3>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={1000}
                  step={10}
                  className="mb-4"
                />
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              {/* Other Filters */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={inStockOnly}
                      onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">In Stock Only</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={onSaleOnly}
                      onCheckedChange={(checked) => {
                        setOnSaleOnly(checked as boolean);
                        updateUrlParams({ sale: checked ? "true" : null });
                      }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">On Sale</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters Overlay */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>
                <div className="p-4 space-y-6">
                  {/* Mobile Search */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Search</h3>
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  {/* Mobile Categories */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">All Products</option>
                      {categories.map((cat) => (
                        <optgroup key={cat._id} label={cat.name}>
                          <option value={cat.slug}>{cat.name}</option>
                          {cat.subcategories?.map((sub) => (
                            <option key={sub._id} value={sub.slug}>
                              &nbsp;&nbsp;{sub.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Mobile Price Range */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Price Range</h3>
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      max={1000}
                      step={10}
                      className="mb-4"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>

                  {/* Mobile Other Filters */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={inStockOnly}
                        onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">In Stock Only</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={onSaleOnly}
                        onCheckedChange={(checked) => setOnSaleOnly(checked as boolean)}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">On Sale</span>
                    </label>
                  </div>

                  {/* Apply Button */}
                  <Button
                    className="w-full"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square rounded-2xl bg-gray-200 dark:bg-gray-800 mb-4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                  {paginatedProducts.map((product) => (
                    viewMode === "grid" ? (
                      // Grid Card
                      <div
                        key={product._id}
                        className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        {/* Image */}
                        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={48} className="text-gray-300 dark:text-gray-600" />
                            </div>
                          )}

                          {/* Badges */}
                          {product.salePrice && product.salePrice < product.price && (
                            <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-bold">
                              -{calculateDiscount(product.price, product.salePrice)}%
                            </span>
                          )}

                          {/* Quick Actions */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700">
                              <Heart size={18} className="text-gray-600 dark:text-gray-300" />
                            </button>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          {product.category && (
                            <Link
                              href={`/products?category=${product.category.slug}`}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {product.category.name}
                            </Link>
                          )}
                          <Link href={`/products/${product.slug}`}>
                            <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 mt-1 mb-2">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < (product.rating || 4)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300 dark:text-gray-600"
                                }
                              />
                            ))}
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {product.salePrice && product.salePrice < product.price ? (
                                <>
                                  <span className="font-bold text-gray-900 dark:text-white">
                                    {formatPrice(product.salePrice)}
                                  </span>
                                  <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(product.price)}
                                  </span>
                                </>
                              ) : (
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {formatPrice(product.price)}
                                </span>
                              )}
                            </div>
                            <Button size="sm" variant="ghost" className="rounded-full">
                              <ShoppingCart size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List Card
                      <div
                        key={product._id}
                        className="group flex gap-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden p-4 hover:shadow-xl transition-all duration-300"
                      >
                        {/* Image */}
                        <div className="relative w-48 h-48 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={48} className="text-gray-300 dark:text-gray-600" />
                            </div>
                          )}
                          {product.salePrice && product.salePrice < product.price && (
                            <span className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-bold">
                              -{calculateDiscount(product.price, product.salePrice)}%
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col">
                          {product.category && (
                            <Link
                              href={`/products?category=${product.category.slug}`}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline w-fit"
                            >
                              {product.category.name}
                            </Link>
                          )}
                          <Link href={`/products/${product.slug}`}>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mt-1">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < (product.rating || 4)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300 dark:text-gray-600"
                                }
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">({product.reviewCount || 0})</span>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                            {product.description || "No description available"}
                          </p>

                          <div className="mt-auto pt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {product.salePrice && product.salePrice < product.price ? (
                                <>
                                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    {formatPrice(product.salePrice)}
                                  </span>
                                  <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(product.price)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                  {formatPrice(product.price)}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Heart size={16} className="mr-2" />
                                Wishlist
                              </Button>
                              <Button size="sm">
                                <ShoppingCart size={16} className="mr-2" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className="w-10"
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Package size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
