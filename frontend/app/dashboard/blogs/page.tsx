"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getMyBlogs, deleteBlog } from "@/redux/features/blogSlice";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle } from "lucide-react";

import BlogCard from "@/components/BlogCard";
import BlogCardSkeleton from "@/components/BlogCardSkeleton";
import CreateBlogDialog from "@/components/dashboard/CreateBlogDialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MyBlogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const { mine: blogs, loading, error } = useSelector(
    (state: RootState) => state.blogs
  );

  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getMyBlogs());
  }, [dispatch]);

  const confirmDelete = async () => {
    if (!deleteId) return;

    await dispatch(deleteBlog(deleteId));

    toast({
      title: "Blog Deleted",
      description: "Your blog has been deleted successfully.",
    });

    setDeleteId(null);
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            My Blogs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage, edit, and publish your content
          </p>
        </div>

        <CreateBlogDialog>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
            <PlusCircle size={20} />
            New Blog
          </button>
        </CreateBlogDialog>
      </header>

      {/* Loading State */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && blogs.length === 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-10 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You haven't created any blogs yet.
          </p>
          <CreateBlogDialog>
            <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <PlusCircle size={18} />
              Create Your First Blog
            </button>
          </CreateBlogDialog>
        </div>
      )}

      {/* Blog Grid */}
      {!loading && !error && blogs.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog: any) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              canEdit
              onEdit={(b) => setEditingBlog(b)}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingBlog && (
        <CreateBlogDialog
          mode="edit"
          blog={editingBlog}
          onClose={() => setEditingBlog(null)}
        >
          <span />
        </CreateBlogDialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              blog.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
