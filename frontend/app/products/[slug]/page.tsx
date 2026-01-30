"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import api from "@/lib/api";
import {
  ChevronRight,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCcw,
  Package,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  discountPrice?: number;
  stock: number;
  primaryImage?: string;
  images?: string[];
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
  rating?: number;
  reviewCount?: number;
  sku?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await api.get(`/products/slug/${slug}`);
        setProduct(res.data.product);
        if (res.data.product?.images?.[0]) {
          setActiveImage(res.data.product.images[0]);
        } else if (res.data.product?.primaryImage) {
          setActiveImage(res.data.product.primaryImage);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchProduct();
  }, [slug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateDiscount = (price: number, salePrice: number) => {
    return Math.round(((price - salePrice) / price) * 100);
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.salePrice || product.discountPrice || product.price,
        image: activeImage || product.primaryImage,
        quantity: qty,
      })
    );
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse" />
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3 animate-pulse" />
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Package size={40} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.push("/products")}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const currentPrice = product.salePrice || product.discountPrice || product.price;
  const hasDiscount = (product.salePrice || product.discountPrice) && currentPrice < product.price;
  const allImages = product.images || (product.primaryImage ? [product.primaryImage] : []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-blue-600 dark:hover:text-blue-400">
              Products
            </Link>
            {product.category && (
              <>
                <ChevronRight size={14} />
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight size={14} />
            <span className="text-gray-900 dark:text-white truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={64} className="text-gray-300 dark:text-gray-600" />
                </div>
              )}

              {/* Discount Badge */}
              {hasDiscount && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-bold">
                  -{calculateDiscount(product.price, currentPrice)}%
                </span>
              )}

              {/* Wishlist & Share */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-colors ${
                    isWishlisted
                      ? "bg-red-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === img
                        ? "border-blue-600"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category */}
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2"
              >
                {product.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < (product.rating || 4)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }
                  />
                ))}
              </div>
              <span className="text-gray-500 dark:text-gray-400">
                {product.reviewCount || 0} reviews
              </span>
              {product.sku && (
                <span className="text-gray-400 dark:text-gray-500">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {product.description?.substring(0, 200) || "No description provided."}
              {product.description && product.description.length > 200 && "..."}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  disabled={product.stock === 0}
                >
                  <Minus size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
                <span className="w-16 text-center font-semibold text-gray-900 dark:text-white">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  disabled={product.stock === 0 || qty >= product.stock}
                >
                  <Plus size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </Button>

              {/* Wishlist Button */}
              <Button
                size="lg"
                variant="outline"
                className="h-12"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  size={20}
                  className={isWishlisted ? "text-red-500 fill-red-500" : ""}
                />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Truck size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Shield size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">100% protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <RefreshCcw size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">30-day policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Package size={20} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Quality Product</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">100% authentic</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-gray-200 dark:border-gray-800 bg-transparent rounded-none p-0 h-auto">
              <TabsTrigger
                value="description"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-3 px-6"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-3 px-6"
              >
                Reviews ({product.reviewCount || 0})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-3 px-6"
              >
                Shipping & Returns
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                    {product.description || "No detailed description available for this product."}
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No reviews yet. Be the first to review this product!
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="mt-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Shipping</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        Free standard shipping on orders over $50
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        Express shipping available at checkout
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        Usually ships within 1-2 business days
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Returns</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        30-day return policy
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        Items must be unused and in original packaging
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        Free returns on defective items
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Added to Cart Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <Check size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Added to Cart!
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {product.name} has been added to your shopping cart.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Continue Shopping
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push("/cart")}
                >
                  Go to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
