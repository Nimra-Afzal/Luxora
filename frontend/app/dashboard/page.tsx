"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store";
import { logout, setUserFromStorage } from "@/redux/features/authSlice";

import { PlusCircle } from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar"; // ✅ ADDED
import RecentBlogs from "@/components/dashboard/RecentBlogs";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import CreateBlogDialog from "@/components/dashboard/CreateBlogDialog";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(setUserFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      {/* ✅ SIDEBAR COMPONENT */}
      <Sidebar />

      {/* Main Dashboard */}
      <main className="flex-1 p-10">

        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Welcome, {user?.username} 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your blogs and see what’s happening today.
            </p>
          </div>

          {/* Create Blog Button → Dialog */}
          <CreateBlogDialog>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <PlusCircle size={20} />
              Create Blog
            </button>
          </CreateBlogDialog>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Blogs */}
          <section className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Recent Blogs
            </h2>
            <RecentBlogs />
          </section>

          {/* Activity Feed */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Activity Feed
            </h2>
            <ActivityFeed />
          </section>

        </div>

      </main>
    </div>
  );
}


