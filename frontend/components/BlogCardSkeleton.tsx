"use client";

export default function BlogCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden flex flex-col animate-pulse">
      
      {/* Image Skeleton */}
      <div className="w-full h-40 bg-gray-200 dark:bg-gray-700" />

      {/* Content Skeleton */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        
        {/* Title */}
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />

        {/* Content lines */}
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />

        {/* Footer */}
        <div className="mt-auto flex justify-between">
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}
