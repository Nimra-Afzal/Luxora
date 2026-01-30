"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Users,
  Folder,
  Package,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "My Blogs",
    href: "/dashboard/blogs",
    icon: FileText,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  const SidebarContent = () => (
    <>
      {/* Logo & Close button */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Luxora
        </Link>
        <button
          onClick={closeMobile}
          className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <div className="pb-2">
          <p className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Menu
          </p>
        </div>

        {/* COMMON LINKS */}
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-blue-600 text-white font-medium shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {/* ADMIN ONLY */}
        {user?.role === "admin" && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Admin
              </p>
            </div>

            <Link
              href="/dashboard/products"
              onClick={closeMobile}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors
                ${
                  pathname.startsWith("/dashboard/products")
                    ? "bg-blue-600 text-white font-medium shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
            >
              <Package size={18} />
              Products
            </Link>

            <Link
              href="/dashboard/categories"
              onClick={closeMobile}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors
                ${
                  pathname.startsWith("/dashboard/categories")
                    ? "bg-blue-600 text-white font-medium shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
            >
              <Folder size={18} />
              Categories
            </Link>

            <Link
              href="/dashboard/users"
              onClick={closeMobile}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors
                ${
                  pathname.startsWith("/dashboard/users")
                    ? "bg-blue-600 text-white font-medium shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
            >
              <Users size={18} />
              Users
            </Link>
          </>
        )}
      </nav>

      {/* Footer: Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Luxora
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}
