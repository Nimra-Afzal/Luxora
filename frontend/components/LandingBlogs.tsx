"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import api from "@/lib/api";
import BlogCard from "@/components/BlogCard"; // ✅ pretty BlogCard

interface Blog {
  _id: string;
  title: string;
  content: string;
  image?: string;
  author: { username: string };
  createdAt?: string;
}

export default function LandingBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useSelector((state: RootState) => state.theme.mode); // ✅ theme added

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs/public");
        setBlogs(res.data.blogs || res.data || []);
      } catch (err: any) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section
      className={`py-16 px-4 transition-colors duration-300 border-b ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-slate-100 border-gray-200"
      }`}
    >
      <h2
        className={`text-3xl font-bold text-center mb-8 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Latest Blogs
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </section>
  );
}
