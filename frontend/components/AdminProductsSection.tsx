"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/redux/features/productSlice";
import { getCategories } from "@/redux/features/categorySlice";
import api from "@/lib/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const productSchema = z.object({
  name: z.string().min(1, "Name required"),
  description: z.string().min(5, "Description too short"),
  price: z.preprocess((v) => Number(v), z.number().nonnegative("Price must be >= 0")),
  image: z.string().optional().nullable(),
  category: z.string().min(1, "Category required"),
});

type FormType = z.infer<typeof productSchema>;

export default function AdminProductsSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { list: products, total, loading } = useSelector((s: RootState) => s.products);
  const { list: categories } = useSelector((s: RootState) => s.categories);
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormType>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    dispatch(getProducts({ page, limit: 20 }));
    dispatch(getCategories());
  }, [dispatch, page]);

  const onSubmit = async (data: FormType) => {
    try {
      if (editingId) {
        await dispatch(updateProduct({ id: editingId, data })).unwrap();
        setEditingId(null);
      } else {
        await dispatch(createProduct(data)).unwrap();
      }
      reset();
    } catch (err: any) {
      // errors handled by thunk with toast
    }
  };

  const startEdit = (p: any) => {
    setEditingId(p._id);
    setValue("name", p.name);
    setValue("description", p.description);
    setValue("price", p.price);
    setValue("image", p.image || "");
    setValue("category", p.category?._id || "");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete product?")) return;
    dispatch(deleteProduct(id));
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("image", file);
    try {
      const res = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.url;
      setValue("image", url);
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Admin Products</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow space-y-2">
        <div>
          <input {...register("name")} placeholder="Name" className="w-full p-2 border rounded" />
          {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
        </div>

        <div>
          <textarea {...register("description")} placeholder="Description" rows={3} className="w-full p-2 border rounded" />
          {errors.description && <div className="text-red-500 text-sm">{errors.description.message}</div>}
        </div>

        <div>
          <input {...register("price")} placeholder="Price" className="w-full p-2 border rounded" />
          {errors.price && <div className="text-red-500 text-sm">{(errors.price as any).message}</div>}
        </div>

        <div>
          <input {...register("image")} placeholder="Image URL (or upload below)" className="w-full p-2 border rounded" />
          <div className="mt-2">
            <input type="file" accept="image/*" onChange={handleFile} />
          </div>
        </div>

        <div>
          <select {...register("category")} className="w-full p-2 border rounded">
            <option value="">Select category</option>
            {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          {errors.category && <div className="text-red-500 text-sm">{errors.category.message}</div>}
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded">
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); reset(); }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>}
        </div>
      </form>

      <div>
        <div className="grid gap-3">
          {loading && <div>Loading...</div>}
          {products.map((p: any) => (
            <div key={p._id} className="bg-white dark:bg-gray-800 p-3 rounded shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-500">{p.category?.name || ""}</div>
                <div className="text-sm font-bold">${p.price}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button disabled={page <= 1} onClick={() => setPage((s) => Math.max(1, s - 1))} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Prev</button>
          <div className="text-sm">Page {page}</div>
          <button disabled={(page * 20) >= (total || 0)} onClick={() => setPage((s) => s + 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </section>
  );
}
