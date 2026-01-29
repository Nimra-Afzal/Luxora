"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import AddProductDialog from "@/components/admin/AddProductDialog";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  category: {
    _id: string;
    name: string;
    parent?: string | null;
  };
  primaryImage?: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") router.replace("/dashboard");
  }, [user, router]);

  async function fetchProducts() {
    try {
      const res = await api.get("/products/admin");
      setProducts(res.data.products);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    setProducts((p) => p.filter((x) => x._id !== id));
  }

  if (loading) return <div className="p-6">Loading products...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>

        <Button
          onClick={() => {
            setEditingProduct(null);
            setOpenDialog(true);
          }}
        >
          + Add Product
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="text-center">
                <td className="border p-2">
                  {p.primaryImage ? (
                    <img
                      src={p.primaryImage}
                      className="h-12 w-12 mx-auto rounded object-cover"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.category.name}</td>
                <td className="border p-2">₹{p.price}</td>
                <td className="border p-2">{p.stock}</td>
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      p.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="border p-2 space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingProduct(p);
                      setOpenDialog(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddProductDialog
        open={openDialog}
        setOpen={setOpenDialog}
        product={editingProduct}
        onSuccess={fetchProducts}
      />
    </div>
  );
}
