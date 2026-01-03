"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Share2, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/components/ui/use-toast";

import Sidebar from "@/components/dashboard/Sidebar"; // ✅ ADDED

export default function ReadBlogPage() {
  const { id } = useParams();
  const { toast } = useToast();

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await api.get(`/blogs/public?id=${id}`);
        const found = res.data.blogs?.find((b: any) => b._id === id);
        if (!found) throw new Error("Blog not found");
        setBlog(found);
      } catch {
        setError("Blog not found or unavailable.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ------------------ Share handlers ------------------ */
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied 🔗",
      description: "Blog link copied to clipboard.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: blog.title,
        text: "Check out this blog!",
        url: window.location.href,
      });
    } else {
      handleCopyLink();
    }
  };

  /* ------------------ Skeleton Loader ------------------ */
  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 animate-pulse">
        <Sidebar />

        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-4 pt-6">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>

          <div className="max-w-5xl mx-auto mt-6 px-4">
            <div className="w-full h-[320px] bg-gray-300 dark:bg-gray-700 rounded-2xl" />
          </div>

          <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
            <div className="h-10 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center text-red-500">
          {error}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1">

        {/* Top Right Share Buttons */}
        <div className="max-w-5xl mx-auto px-4 pt-6 flex justify-end gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-lg border bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Share2 size={16} />
          </button>
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-lg border bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Copy size={16} />
          </button>
        </div>

        {/* Hero Image */}
        {blog.image && (
          <div className="max-w-5xl mx-auto mt-6 px-4">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full max-h-[420px] object-cover rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Article */}
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span>
              By{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {blog.author?.username || "Unknown"}
              </span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700 my-8" />

          {/* Markdown Content */}
          <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
}

