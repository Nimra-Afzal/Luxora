"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { PlusCircle } from "lucide-react";

import RecentBlogs from "@/components/dashboard/RecentBlogs";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import CreateBlogDialog from "@/components/dashboard/CreateBlogDialog";

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
            Welcome back, {user?.username}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your blogs and see what's happening today.
          </p>
        </div>

        {/* Create Blog Button */}
        <CreateBlogDialog>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
            <PlusCircle size={20} />
            Create Blog
          </button>
        </CreateBlogDialog>
      </header>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Blogs */}
        <section className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Recent Blogs
          </h2>
          <RecentBlogs />
        </section>

        {/* Activity Feed */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Activity Feed
          </h2>
          <ActivityFeed />
        </section>
      </div>
    </div>
  );
}
