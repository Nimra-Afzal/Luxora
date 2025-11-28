"use client";
import BlogCard from "./BlogCard";

export default function BlogList({ blogs, canEdit = false, onEdit, onDelete }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((b: any) => (
        <BlogCard key={b._id || b.id} blog={b} canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
