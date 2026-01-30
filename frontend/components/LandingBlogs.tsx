"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface Blog {
  _id: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  image?: string;
  author: { username: string; profilePicture?: string };
  createdAt?: string;
  readTime?: number;
}

export default function LandingBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs/public");
        const blogsData = res.data.blogs || res.data || [];
        setBlogs(blogsData.slice(0, 3));
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getExcerpt = (content: string, maxLength = 120) => {
    const plainText = content.replace(/<[^>]*>/g, "");
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + "...";
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
              <BookOpen size={16} />
              Our Blog
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Latest Articles
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Stay updated with the latest trends, tips, and insights
            </p>
          </div>
          <Link href="/blogs" className="mt-6 md:mt-0">
            <Button
              variant="outline"
              className="rounded-full border-gray-300 dark:border-gray-700"
            >
              View All Posts
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] rounded-2xl bg-gray-200 dark:bg-gray-800 mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2 w-1/4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <article
                key={blog._id}
                className={`group ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <Link href={`/blogs/${blog.slug || blog._id}`}>
                  <div
                    className={`relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 ${
                      index === 0 ? "aspect-[16/9]" : "aspect-[16/10]"
                    } mb-4`}
                  >
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                        <BookOpen
                          size={index === 0 ? 64 : 40}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {blog.author && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {blog.author.profilePicture ? (
                          <Image
                            src={blog.author.profilePicture}
                            alt={blog.author.username}
                            width={24}
                            height={24}
                            className="object-cover"
                          />
                        ) : (
                          <User size={14} className="text-gray-400" />
                        )}
                      </div>
                      <span>{blog.author.username}</span>
                    </div>
                  )}
                  {blog.createdAt && (
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{blog.readTime || estimateReadTime(blog.content)} min read</span>
                  </div>
                </div>

                {/* Title */}
                <Link href={`/blogs/${blog.slug || blog._id}`}>
                  <h3
                    className={`font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 ${
                      index === 0 ? "text-2xl" : "text-lg"
                    }`}
                  >
                    {blog.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                  {blog.excerpt || getExcerpt(blog.content)}
                </p>

                {/* Read More */}
                <Link
                  href={`/blogs/${blog.slug || blog._id}`}
                  className="inline-flex items-center gap-1 mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                >
                  Read More
                  <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <BookOpen size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Articles Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Check back later for new content
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
