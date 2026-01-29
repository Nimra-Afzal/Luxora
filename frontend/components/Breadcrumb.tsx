"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryBreadcrumb } from "@/redux/features/categorySlice";
import { RootState, AppDispatch } from "@/redux/store";

export default function Breadcrumb({ slug }: { slug: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { breadcrumb, breadcrumbLoading } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    if (slug) {
      dispatch(fetchCategoryBreadcrumb(slug));
    }
  }, [slug, dispatch]);

  if (breadcrumbLoading) return <p>Loading...</p>;

  return (
    <nav aria-label="breadcrumb">
      <ul style={{ display: "flex", gap: "8px" }}>
        <li>
          <Link href="/">Home</Link>
        </li>

        {breadcrumb.map((item: any, index: number) => (
          <li key={item._id}>
            {" > "}
            <Link href={`/category/${item.slug}`}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
