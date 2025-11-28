"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "@/redux/features/productSlice";
import { RootState, AppDispatch } from "@/redux/store";
import ProductCard from "./ProductCard";

export default function ProductsGrid({ perPage = 9 }: { perPage?: number }) {
  const dispatch = useDispatch<AppDispatch>();
  const { list, total, loading } = useSelector((s: RootState) => s.products);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getProducts({ page, limit: perPage }));
  }, [dispatch, page, perPage]);

  return (
    <section className="py-12 bg-slate-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Products</h2>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {list.map((p: any) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">Showing page {page} / {Math.ceil((total || 0) / perPage)}</div>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage((s) => Math.max(1, s - 1))} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Prev</button>
                <button disabled={page >= Math.ceil((total || 0) / perPage)} onClick={() => setPage((s) => s + 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
