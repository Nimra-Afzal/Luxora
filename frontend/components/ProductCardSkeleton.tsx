export default function ProductCardSkeleton() {
  return (
    <div className="w-[260px] animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-8 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
