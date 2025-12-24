// // // "use client";

// // // import { useEffect, useState } from "react";
// // // import api from "@/lib/api";
// // // import Link from "next/link";

// // // interface Blog {
// // //   _id: string;
// // //   title: string;
// // //   content: string;
// // //   image?: string;
// // //   createdAt: string;
// // // }

// // // export default function RecentBlogs() {
// // //   const [blogs, setBlogs] = useState<Blog[]>([]);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     (async () => {
// // //       try {
// // //         const res = await api.get("/blogs/my?limit=3");
// // //         setBlogs(res.data.blogs || res.data);
// // //       } catch (err) {
// // //         console.error("Error fetching recent blogs:", err);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     })();
// // //   }, []);

// // //   if (loading) return <p className="text-gray-500">Loading recent blogs...</p>;

// // //   if (blogs.length === 0)
// // //     return <p className="text-gray-500">No blogs yet.</p>;

// // //   return (
// // //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// // //       {blogs.map((blog) => (
// // //         <Link
// // //           key={blog._id}
// // //           href={`/blogs/${blog._id}`}
// // //           className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition"
// // //         >
// // //           <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
// // //             {blog.title}
// // //           </h3>
// // //           <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
// // //             {blog.content}
// // //           </p>
// // //           <p className="text-xs text-gray-400 mt-4">
// // //             {new Date(blog.createdAt).toLocaleDateString()}
// // //           </p>
// // //         </Link>
// // //       ))}
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import api from "@/lib/api";

// // import {
// //   Card,
// //   CardHeader,
// //   CardTitle,
// //   CardContent,
// // } from "@/components/ui/card";

// // type Blog = {
// //   _id: string;
// //   title: string;
// //   content: string;
// //   createdAt: string;
// // };

// // export default function RecentBlogs() {
// //   const [blogs, setBlogs] = useState<Blog[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const router = useRouter();

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         // ✅ Only logged-in user's blogs
// //         const res = await api.get("/blogs/my?limit=3");
// //         setBlogs(res.data.blogs || []);
// //       } catch (err) {
// //         console.error("Error fetching recent blogs:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     })();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <p className="text-sm text-gray-500">Loading recent blogs...</p>
// //     );
// //   }

// //   if (blogs.length === 0) {
// //     return (
// //       <div className="text-sm text-gray-500">
// //         You haven’t published any blogs yet.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //       {blogs.map((blog) => (
// //         <Card
// //           key={blog._id}
// //           onClick={() => router.push(`/blogs/${blog._id}`)}
// //           className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
// //         >
// //           <CardHeader className="pb-2">
// //             <CardTitle className="text-lg line-clamp-1">
// //               {blog.title}
// //             </CardTitle>
// //           </CardHeader>

// //           <CardContent className="flex flex-col justify-between h-[120px]">
// //             <p className="text-sm text-gray-600 line-clamp-2">
// //               {blog.content}
// //             </p>

// //             <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
// //               <span>
// //                 {new Date(blog.createdAt).toLocaleDateString()}
// //               </span>
// //               <span className="text-blue-600 font-medium">
// //                 Read →
// //               </span>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       ))}
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useState } from "react";
// import api from "@/lib/api";
// import Link from "next/link";

// export default function RecentBlogs() {
//   const [blogs, setBlogs] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         // ✅ ONLY USER BLOGS (same user as My Blogs)
//         const res = await api.get("/blogs/my");
//         setBlogs(res.data.blogs.slice(0, 3)); // latest 3
//       } catch (err) {
//         console.error("Error fetching recent blogs:", err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   if (loading) {
//     return <p className="text-gray-500 dark:text-gray-400">Loading...</p>;
//   }

//   if (blogs.length === 0) {
//     return (
//       <p className="text-gray-600 dark:text-gray-300">
//         No blogs created yet.
//       </p>
//     );
//   }

//   return (
//     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//       {blogs.map((blog) => (
//         <div
//           key={blog._id}
//           className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden flex flex-col"
//         >
//           {/* Image */}
//           <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
//             {blog.image ? (
//               <img
//                 src={blog.image}
//                 alt={blog.title}
//                 className="h-full w-full object-cover"
//               />
//             ) : (
//               <span className="text-gray-500 text-sm">No Image</span>
//             )}
//           </div>

//           {/* Content */}
//           <div className="p-4 flex flex-col flex-1">
//             <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
//               <span>{blog.author?.username}</span>
//               <span>
//                 {new Date(blog.createdAt).toLocaleDateString()}
//               </span>
//             </div>

//             <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
//               {blog.title}
//             </h3>

//             <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-1">
//               {blog.content}
//             </p>

//             {/* ✅ ONLY READ BUTTON */}
//             <Link
//               href={`/blogs/${blog._id}`}
//               className="mt-4 inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
//             >
//               Read Blog
//             </Link>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

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


