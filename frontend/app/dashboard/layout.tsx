"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store";
import { setUserFromStorage } from "@/redux/features/authSlice";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Restore auth state on mount
  useEffect(() => {
    dispatch(setUserFromStorage());
  }, [dispatch]);

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Admin-only routes protection
  const adminRoutes = ["/dashboard/products", "/dashboard/categories", "/dashboard/users"];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    if (isAdminRoute && user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [isAdminRoute, user, router]);

  // Show loading state while checking auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Desktop: flex layout with sidebar */}
      <div className="lg:flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <DashboardHeader />
          <main className="flex-1 lg:overflow-auto">
            {/* Mobile: add padding top for fixed header */}
            <div className="lg:pt-0 pt-14">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
