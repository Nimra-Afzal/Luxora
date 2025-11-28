"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, getCategories, deleteCategory } from "@/redux/features/categorySlice";
import { AppDispatch, RootState } from "@/redux/store";

export default function AdminCategoryForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector((s: RootState) => s.categories);
  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name required");
    await dispatch(createCategory({ name })).unwrap().catch((err) => alert(err));
    setName("");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete category?")) return;
    dispatch(deleteCategory(id));
  };

  return (
    <div className="mb-6">
      <form onSubmit={submit} className="flex gap-2 mb-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category" className="px-3 py-2 border rounded w-full" />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
      </form>

      <div>
        {loading ? <div>Loading categories...</div> : (
          <ul className="space-y-2">
            {list.map((c: any) => (
              <li key={c._id} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                <span>{c.name}</span>
                <button onClick={() => handleDelete(c._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
