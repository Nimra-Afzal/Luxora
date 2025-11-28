"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getMyBlogs, createBlog, updateBlog, deleteBlog } from "@/redux/features/blogSlice";
import BlogList from "./BlogList";

export default function MyBlogsSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { mine, loading, error } = useSelector((s: RootState) => s.blogs);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(""); // ✅ image state
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getMyBlogs());
  }, [dispatch]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await dispatch(updateBlog({ id: editingId, data: { title, content, image } }));
      setEditingId(null);
    } else {
      await dispatch(createBlog({ title, content, image }));
    }

    // reset form
    setTitle("");
    setContent("");
    setImage("");
  };

  const handleEdit = (blog: any) => {
    setEditingId(blog._id);
    setTitle(blog.title);
    setContent(blog.content);
    setImage(blog.image || ""); // ✅ load image if exists
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this blog?")) return;
    dispatch(deleteBlog(id));
  };

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">My Blogs</h2>

      <form
        onSubmit={onSubmit}
        className="mb-6 bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          rows={4}
          className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
        ></textarea>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL (optional)"
          className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setContent("");
                setImage("");
              }}
              type="button"
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading && <div className="text-gray-700 dark:text-gray-300">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <BlogList blogs={mine} canEdit onEdit={handleEdit} onDelete={handleDelete} />
    </section>
  );
}
