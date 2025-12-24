// // // "use client";

// // // import { useEffect } from "react";
// // // import { useDispatch, useSelector } from "react-redux";
// // // import { AppDispatch, RootState } from "@/redux/store";
// // // import { getMyBlogs, deleteBlog } from "@/redux/features/blogSlice";

// // // import BlogCard from "@/components/BlogCard";
// // // import Sidebar from "@/components/dashboard/Sidebar";

// // // export default function MyBlogsPage() {
// // //   const dispatch = useDispatch<AppDispatch>();
// // //   const { mine: blogs, loading, error } = useSelector(
// // //     (state: RootState) => state.blogs
// // //   );

// // //   useEffect(() => {
// // //     dispatch(getMyBlogs());
// // //   }, [dispatch]);

// // //   const handleDelete = (id: string) => {
// // //     if (!confirm("Are you sure you want to delete this blog?")) return;
// // //     dispatch(deleteBlog(id));
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
// // //         <Sidebar />
// // //         <main className="flex-1 p-10 flex items-center justify-center">
// // //           <p className="text-gray-500 dark:text-gray-400">Loading blogs...</p>
// // //         </main>
// // //       </div>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
// // //         <Sidebar />
// // //         <main className="flex-1 p-10 flex items-center justify-center">
// // //           <p className="text-red-500">{error}</p>
// // //         </main>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
// // //       {/* Sidebar */}
// // //       <Sidebar />

// // //       {/* Main Content */}
// // //       <main className="flex-1 p-10">
// // //         <header className="mb-8">
// // //           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
// // //             My Blogs
// // //           </h1>
// // //           <p className="text-gray-600 dark:text-gray-400 mt-1">
// // //             Manage, edit, and publish your content
// // //           </p>
// // //         </header>

// // //         {blogs.length === 0 ? (
// // //           <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-10 text-center">
// // //             <p className="text-gray-600 dark:text-gray-300">
// // //               You haven’t created any blogs yet.
// // //             </p>
// // //           </div>
// // //         ) : (
// // //           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
// // //             {blogs.map((blog: any) => (
// // //               <BlogCard
// // //                 key={blog._id}
// // //                 blog={blog}
// // //                 canEdit
// // //                 onDelete={handleDelete}
// // //               />
// // //             ))}
// // //           </div>
// // //         )}
// // //       </main>
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { AppDispatch, RootState } from "@/redux/store";
// // import { getMyBlogs, deleteBlog } from "@/redux/features/blogSlice";

// // import BlogCard from "@/components/BlogCard";
// // import Sidebar from "@/components/dashboard/Sidebar";
// // import CreateBlogDialog from "@/components/dashboard/CreateBlogDialog"; // ✅ ADDED

// // export default function MyBlogsPage() {
// //   const dispatch = useDispatch<AppDispatch>();
// //   const { mine: blogs, loading, error } = useSelector(
// //     (state: RootState) => state.blogs
// //   );

// //   useEffect(() => {
// //     dispatch(getMyBlogs());
// //   }, [dispatch]);

// //   const handleDelete = (id: string) => {
// //     if (!confirm("Are you sure you want to delete this blog?")) return;
// //     dispatch(deleteBlog(id));
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
// //         <Sidebar />
// //         <main className="flex-1 p-10 flex items-center justify-center">
// //           <p className="text-gray-500 dark:text-gray-400">
// //             Loading blogs...
// //           </p>
// //         </main>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
// //         <Sidebar />
// //         <main className="flex-1 p-10 flex items-center justify-center">
// //           <p className="text-red-500">{error}</p>
// //         </main>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
// //       {/* Sidebar */}
// //       <Sidebar />

// //       {/* Main Content */}
// //       <main className="flex-1 p-10">
// //         <header className="mb-8">
// //           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
// //             My Blogs
// //           </h1>
// //           <p className="text-gray-600 dark:text-gray-400 mt-1">
// //             Manage, edit, and publish your content
// //           </p>
// //         </header>

// //         {blogs.length === 0 ? (
// //           <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-10 text-center">
// //             <p className="text-gray-600 dark:text-gray-300">
// //               You haven’t created any blogs yet.
// //             </p>
// //           </div>
// //         ) : (
// //           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
// //             {blogs.map((blog: any) => (
// //               <CreateBlogDialog
// //                 key={blog._id}
// //                 mode="edit"
// //                 blog={blog}
// //                 onSuccess={() => dispatch(getMyBlogs())} // ✅ refresh after edit
// //               >
// //                 <BlogCard
// //                   blog={blog}
// //                   canEdit
// //                   onDelete={handleDelete}
// //                 />
// //               </CreateBlogDialog>
// //             ))}
// //           </div>
// //         )}
// //       </main>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/redux/store";
// import { getMyBlogs, deleteBlog } from "@/redux/features/blogSlice";

// import BlogCard from "@/components/BlogCard";
// import Sidebar from "@/components/dashboard/Sidebar";
// import CreateBlogDialog from "@/components/dashboard/CreateBlogDialog";

// export default function MyBlogsPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { mine: blogs, loading, error } = useSelector(
//     (state: RootState) => state.blogs
//   );

//   const [editingBlog, setEditingBlog] = useState<any | null>(null);

//   useEffect(() => {
//     dispatch(getMyBlogs());
//   }, [dispatch]);

//   const handleDelete = (id: string) => {
//     if (!confirm("Are you sure you want to delete this blog?")) return;
//     dispatch(deleteBlog(id));
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
//         <Sidebar />
//         <main className="flex-1 p-10 flex items-center justify-center">
//           <p className="text-gray-500 dark:text-gray-400">Loading blogs...</p>
//         </main>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
//         <Sidebar />
//         <main className="flex-1 p-10 flex items-center justify-center">
//           <p className="text-red-500">{error}</p>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
//       <Sidebar />

//       <main className="flex-1 p-10">
//         <header className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             My Blogs
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             Manage, edit, and publish your content
//           </p>
//         </header>

//         {blogs.length === 0 ? (
//           <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-10 text-center">
//             <p className="text-gray-600 dark:text-gray-300">
//               You haven’t created any blogs yet.
//             </p>
//           </div>
//         ) : (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {blogs.map((blog: any) => (
//               <BlogCard
//                 key={blog._id}
//                 blog={blog}
//                 canEdit
//                 onEdit={(b) => setEditingBlog(b)}   // ✅ FIX
//                 onDelete={handleDelete}
//               />
//             ))}
//           </div>
//         )}
//       </main>

//       {/* ✅ EDIT BLOG DIALOG */}
//       {editingBlog && (
//         <CreateBlogDialog
//           mode="edit"
//           blog={editingBlog}
//           onClose={() => setEditingBlog(null)}
//         >
//           <span />
//         </CreateBlogDialog>
//       )}
//     </div>
//   );
// }

// "use client"

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/redux/store";
// import { getMyBlogs, deleteBlog } from "@/redux/features/blogSlice";
// import { useToast } from "@/components/ui/use-toast";

// import BlogCard from "@/components/BlogCard";
// import Sidebar from "@/components/dashboard/Sidebar";
// import CreateBlogDialog from "@/components/dashboard/CreateBlogDialog";

// export default function MyBlogsPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { toast } = useToast();

//   const { mine: blogs, loading, error } = useSelector(
//     (state: RootState) => state.blogs
//   );

//   const [editingBlog, setEditingBlog] = useState<any | null>(null);

//   useEffect(() => {
//     dispatch(getMyBlogs());
//   }, [dispatch]);

//   const handleDelete = async (id: string) => {
//     await dispatch(deleteBlog(id));

//     toast({
//       title: "Blog Deleted 🗑️",
//       description: "Your blog has been deleted successfully.",
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
//         <Sidebar />
//         <main className="flex-1 p-10 flex items-center justify-center">
//           <p className="text-gray-500">Loading blogs...</p>
//         </main>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
//         <Sidebar />
//         <main className="flex-1 p-10 flex items-center justify-center">
//           <p className="text-red-500">{error}</p>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
//       <Sidebar />

//       <main className="flex-1 p-10">
//         <header className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             My Blogs
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Manage, edit, and publish your content
//           </p>
//         </header>

//         {blogs.length === 0 ? (
//           <div className="bg-white dark:bg-gray-800 border rounded-xl p-10 text-center">
//             <p className="text-gray-600">You haven’t created any blogs yet.</p>
//           </div>
//         ) : (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {blogs.map((blog: any) => (
//               <BlogCard
//                 key={blog._id}
//                 blog={blog}
//                 canEdit
//                 onEdit={(b) => setEditingBlog(b)}
//                 onDelete={handleDelete}
//               />
//             ))}
//           </div>
//         )}
//       </main>

//       {/* Edit Dialog */}
//       {editingBlog && (
//         <CreateBlogDialog
//           mode="edit"
//           blog={editingBlog}
//           onClose={() => setEditingBlog(null)}
//         >
//           <span />
//         </CreateBlogDialog>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getMyBlogs, deleteBlog } from "@/redux/features/blogSlice";
import { useToast } from "@/components/ui/use-toast";
import BlogCardSkeleton from "@/components/BlogCardSkeleton";


import BlogCard from "@/components/BlogCard";
import Sidebar from "@/components/dashboard/Sidebar";
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
      title: "Blog Deleted 🗑️",
      description: "Your blog has been deleted successfully.",
    });

    setDeleteId(null);
  };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
//         <Sidebar />
//         <main className="flex-1 p-10 flex items-center justify-center">
//           <p className="text-gray-500">Loading blogs...</p>
//         </main>
//       </div>
//     );
//   }
if (loading) {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}


  if (error) {
    return (
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 p-10 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />

      <main className="flex-1 p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Blogs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage, edit, and publish your content
          </p>
        </header>

        {blogs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border rounded-xl p-10 text-center">
            <p className="text-gray-600">You haven’t created any blogs yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog: any) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                canEdit
                onEdit={(b) => setEditingBlog(b)}
                onDelete={(id) => setDeleteId(id)} // ✅ OPEN DIALOG
              />
            ))}
          </div>
        )}
      </main>

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

