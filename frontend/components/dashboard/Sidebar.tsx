"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/authSlice";
import { AppDispatch, RootState } from "@/redux/store";

import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Users,
  Folder,
  Package,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Blogs",
    href: "/dashboard/blogs",
    icon: FileText,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 text-2xl font-bold text-blue-600">
        Luxora
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {/* COMMON LINKS */}
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-white"
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
            <Link
              href="/dashboard/products"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${
                  pathname === "/dashboard/products"
                    ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
            >
              <Package size={18} />
              Products
            </Link>

            <Link
              href="/dashboard/categories"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${
                  pathname === "/dashboard/categories"
                    ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
            >
              <Folder size={18} />
              Categories
            </Link>

            <Link
              href="/dashboard/users"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${
                  pathname === "/dashboard/users"
                    ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-white"
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

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

