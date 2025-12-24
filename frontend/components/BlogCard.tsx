// // "use client";
// // import React from "react";

// // export default function BlogCard({
// //   blog,
// //   canEdit,
// //   onEdit,
// //   onDelete,
// // }: {
// //   blog: any;
// //   canEdit?: boolean;
// //   onEdit?: (b: any) => void;
// //   onDelete?: (id: string) => void;
// // }) {
// //   return (
// //     <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden flex flex-col">
// //       {/* ✅ Image Section */}
// //       {blog.image ? (
// //         <img
// //           src={blog.image}
// //           alt={blog.title}
// //           className="w-full h-40 object-cover"
// //         />
// //       ) : (
// //         <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
// //           No Image
// //         </div>
// //       )}

// //       {/* ✅ Blog Content */}
// //       <div className="p-4 flex flex-col flex-1">
// //         <div className="flex justify-between items-start">
// //           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
// //             {blog.title}
// //           </h3>
// //           <span className="text-xs text-gray-500 dark:text-gray-400">
// //             {new Date(blog.createdAt).toLocaleDateString()}
// //           </span>
// //         </div>

// //         <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 flex-1">
// //           {blog.content}
// //         </p>

// //         <div className="mt-3 flex items-center justify-between">
// //           <p className="text-xs text-gray-500 dark:text-gray-400 italic">
// //             by {blog.author?.username || "Unknown"}
// //           </p>

// //           {canEdit && (
// //             <div className="flex items-center gap-2">
// //               <button
// //                 onClick={() => onEdit?.(blog)}
// //                 className="px-2 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-xs transition"
// //               >
// //                 Edit
// //               </button>
// //               <button
// //                 onClick={() => onDelete?.(blog._id)}
// //                 className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs transition"
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </article>
// //   );
// // }

// "use client";
// import React from "react";
// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";

// export default function BlogCard({
//   blog,
//   canEdit,
//   onEdit,
//   onDelete,
// }: {
//   blog: any;
//   canEdit?: boolean;
//   onEdit?: (b: any) => void;
//   onDelete?: (id: string) => void;
// }) {
//   return (
//     <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden flex flex-col">
//       {/* Image */}
//       {blog.image ? (
//         <img
//           src={blog.image}
//           alt={blog.title}
//           className="w-full h-40 object-cover"
//         />
//       ) : (
//         <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-sm">
//           No Image
//         </div>
//       )}

//       {/* Content */}
//       <div className="p-4 flex flex-col flex-1">
//         <div className="flex justify-between items-start">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
//             {blog.title}
//           </h3>
//           <span className="text-xs text-gray-500">
//             {new Date(blog.createdAt).toLocaleDateString()}
//           </span>
//         </div>

//         <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 flex-1">
//           {blog.content}
//         </p>

//         <div className="mt-4 flex items-center justify-between">
//           <p className="text-xs text-gray-500 italic">
//             by {blog.author?.username || "Unknown"}
//           </p>

//           {canEdit && (
//             <div className="flex items-center gap-2">
//               {/* Edit */}
//               <button
//                 onClick={() => onEdit?.(blog)}
//                 className="px-3 py-1 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-xs"
//               >
//                 Edit
//               </button>

//               {/* Delete with AlertDialog */}
//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <button className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs">
//                     Delete
//                   </button>
//                 </AlertDialogTrigger>

//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle>
//                       Delete this blog?
//                     </AlertDialogTitle>
//                     <AlertDialogDescription>
//                       This action cannot be undone. This will permanently
//                       delete your blog.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>

//                   <AlertDialogFooter>
//                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                     <AlertDialogAction
//                       onClick={() => onDelete?.(blog._id)}
//                       className="bg-red-600 hover:bg-red-700"
//                     >
//                       Delete
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             </div>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// }

"use client";

import React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function BlogCard({
  blog,
  canEdit,
  onEdit,
  onDelete,
}: {
  blog: any;
  canEdit?: boolean;
  onEdit?: (b: any) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden flex flex-col">
      {/* Image */}
      {blog.image ? (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-sm">
          No Image
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
            {blog.title}
          </h3>

          {canEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                  <MoreVertical size={18} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem asChild>
                  <Link href={`/blogs/${blog._id}`}>Read</Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onEdit?.(blog)}>
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => onDelete?.(blog._id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 flex-1">
          {blog.content}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>by {blog.author?.username || "Unknown"}</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
}
