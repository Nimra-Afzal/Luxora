"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getMyBlogs, deleteBlog } from "@/redux/features/blogSlice";
import BlogCard from "@/components/BlogCard";

export default function MyBlogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { mine: blogs, loading, error } = useSelector(
    (state: RootState) => state.blogs
  );

  useEffect(() => {
    dispatch(getMyBlogs());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this blog?")) return;
    dispatch(deleteBlog(id));
  };

  if (loading)
    return <div className="p-10 text-center">Loading...</div>;

  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <section className="mt-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        My Blogs
      </h2>

      {blogs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          You haven’t created any blogs yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6 w-[300px] ml-4">
          {blogs.map((blog: any) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              canEdit
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
