"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleWishlist } from "@/redux/features/wishlistSlice";
import { addToCart } from "@/redux/features/cartSlice";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.wishlist.items);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
            <Heart size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Save items you love for later.
          </p>
          <Link href="/products">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ShoppingCart size={18} className="mr-2" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 dark:text-white">Wishlist</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Wishlist ({items.length} {items.length === 1 ? "item" : "items"})
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">

          {/* Top Actions */}
          <div className="flex items-center justify-between">
            <Link
              href="/products"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => {
                items.forEach((item) =>
                  dispatch(toggleWishlist(item))
                );
                toast.success("Wishlist cleared");
              }}
            >
              <Trash2 size={16} className="mr-2" />
              Clear Wishlist
            </Button>
          </div>

          {/* Wishlist Items */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {items.map((item, index) => (
              <div
                key={item.productId}
                className={`flex gap-4 p-4 ${
                  index !== items.length - 1
                    ? "border-b border-gray-200 dark:border-gray-800"
                    : ""
                }`}
              >
                {/* Image */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {item.name}
                  </h3>

                  <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center gap-3">

                    {/* Move to Cart */}
                    <Button
                      size="sm"
                      onClick={() => {
                        dispatch(
                          addToCart({
                            productId: item.productId,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            quantity: 1,
                          })
                        );

                        dispatch(toggleWishlist(item));

                        toast.success("Moved to cart");
                      }}
                    >
                      <ShoppingCart size={16} className="mr-2" />
                      Add to Cart
                    </Button>

                    {/* Remove */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        dispatch(toggleWishlist(item));
                        toast.success("Removed from wishlist");
                      }}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
