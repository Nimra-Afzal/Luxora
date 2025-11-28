"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  category: { _id: string; name: string };
}

export default function ProductsListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products"); // admin route
        // backend returns { products: [...] }
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        alert("❌ Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      alert("✅ Product deleted");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("❌ Failed to delete product");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <button
        onClick={() => router.push("/dashboard/products/create")}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Add Product
      </button>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg shadow p-4 flex flex-col"
            >
              {product.image ? (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded mb-4 overflow-hidden">
                  <img
                    src={
                      product.image?.startsWith("http")
                        ? product.image
                        : `http://localhost:5000${product.image}`
                    }
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-4">
                  No Image
                </div>
              )}

              <h2 className="text-lg font-semibold truncate">{product.name}</h2>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <p className="text-gray-500 truncate">
                Category: {product.category?.name}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() =>
                    router.push(`/dashboard/products/${product._id}/edit`)
                  }
                  className="flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
