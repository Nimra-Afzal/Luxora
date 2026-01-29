"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import toast from "react-hot-toast";

import { useSelector } from "react-redux";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  primaryImage?: string;
  images?: string[];
  category?: {
    name: string;
    slug: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await api.get(`/products/slug/${slug}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error("Failed to fetch product", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 animate-pulse">
        <div className="h-80 bg-gray-200 rounded mb-6" />
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Product not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Image
      <div className="bg-gray-100 rounded-lg flex items-center justify-center">
        {product.primaryImage ? (
          <img
            src={product.primaryImage}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-gray-500">No Image</div>
        )}
      </div> */}

      <div>
        {/* Main Image */}
        <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
          <img
            src={activeImage || product.primaryImage}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-3 mt-4">
          {product.images?.map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              onClick={() => setActiveImage(img)}
              className={`w-16 h-16 object-contain border rounded cursor-pointer ${
                activeImage === img ? "border-blue-600" : "border-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="text-sm text-gray-500 mt-1">
          Category: {product.category?.name}
        </p>

        <div className="mt-4 text-2xl font-semibold">${product.price}</div>

        <div className="mt-2">
          {product.stock > 0 ? (
            <span className="text-green-600">In Stock</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </div>

        <p className="mt-6 text-gray-700">
          {product.description || "No description provided."}
        </p>

        <div className="mt-8 flex gap-4">
          <div className="mt-8 flex items-center gap-4">
            {/* Quantity */}
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2"
              >
                −
              </button>
              <span className="px-4">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2"
              >
                +
              </button>
            </div>

            {/* Add to cart */}
            <button
              onClick={() => {
                dispatch(
                  addToCart({
                    productId: product._id,
                    name: product.name,
                    price: product.discountPrice ?? product.price,
                    image: product.primaryImage,
                    quantity: qty,
                  })
                );
                setShowModal(true);
              }}
              className="px-6 py-3 bg-black text-white rounded"
            >
              ADD TO CART
            </button>
          </div>
          {/* <button disabled className="px-6 py-3 border rounded opacity-60">
            ❤️ Wishlist
          </button> */}
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-[90%] max-w-md text-center">
              <p className="mb-6 font-medium">
                {product.name} is added to your shopping cart.
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  CONTINUE SHOPPING
                </button>
                <button
                  onClick={() => router.push("/cart")}
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  GO TO CART
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
