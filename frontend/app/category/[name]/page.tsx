"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  category: {
    name: string;
    slug: string;
  };
}

export default function CategoryPage() {
  const params = useParams();
  const categoryName = params.name;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/products/category/${categoryName}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categoryName]);

  if (loading) return <p className="p-4">Loading products...</p>;
  if (!products.length) return <p className="p-4">No products found in this category.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="border rounded-lg p-4 shadow hover:shadow-md transition"
        >
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />
          )}
          <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
          <p className="text-gray-600 mt-1">{product.description}</p>
          <p className="font-bold mt-2">${product.price}</p>
        </div>
      ))}
    </div>
  );
}
