"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

export default function RecentBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // ✅ PUBLIC BLOGS (ANY USER)
        const res = await api.get("/blogs/public?limit=3");
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Error fetching recent blogs:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading...</p>;
  }

  if (blogs.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-300">
        No blogs published yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden flex flex-col"
        >
          {/* Image */}
          <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {blog.image ? (
              <img
                src={blog.image}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm">No Image</span>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>{blog.author?.username || "Unknown"}</span>
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {blog.title}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-1">
              {blog.content}
            </p>

            {/* ✅ ONLY READ BUTTON */}
            <Link
              href={`/blogs/${blog._id}`}
              className="mt-4 inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Read Blog
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}


