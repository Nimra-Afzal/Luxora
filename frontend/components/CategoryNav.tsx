"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryTree } from "@/redux/features/categorySlice";
import CategoryNode from "./CategoryNode";
import { RootState, AppDispatch } from "@/redux/store";

export default function CategoryNav() {
  const dispatch = useDispatch<AppDispatch>();
  const { tree, treeLoading } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategoryTree());
  }, [dispatch]);

  if (treeLoading) return <p>Loading categories...</p>;

  return (
    <nav>
      <ul>
        {tree.map((cat: any) => (
          <CategoryNode key={cat._id} category={cat} />
        ))}
      </ul>
    </nav>
  );
}
