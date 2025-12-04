"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store";
import { logout, setUserFromStorage } from "@/redux/features/authSlice";
import MyBlogsSection from "@/components/MyBlogsSection";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Users,
  Package,
  Tags,
} from "lucide-react";
import Link from "next/link";

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

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
      

        <nav className="flex-1 p-4 space-y-2">
        

          <Link
            href="/dashboard/blogs"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            <FileText size={18} /> My Blogs
          </Link>

        

          {user?.role === "admin" && (
            <>
              <Link
                href="/dashboard/products"
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <Package size={18} /> Manage Products
              </Link>

              <Link
                href="/dashboard/categories"
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <Tags size={18} /> Manage Categories
              </Link>
            </>
          )}

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            <Settings size={18} /> Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-300">
            Welcome, {user?.username || "User"} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Here’s an overview of your activity today.
          </p>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Blogs
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              12
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Followers
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              350
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Drafts
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              5
            </p>
          </div>
        </div>

        {/* Blogs Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <MyBlogsSection />
        </section>
      </main>
    </div>
  );
}
