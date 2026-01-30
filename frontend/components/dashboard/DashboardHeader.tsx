"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/authSlice";
import { toggleTheme } from "@/redux/features/themeSlice";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Sun, Moon } from "lucide-react";

export default function DashboardHeader() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <header className="hidden lg:flex items-center justify-end px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Avatar className="h-10 w-10 cursor-pointer border-2 border-blue-500 hover:border-blue-600 transition-colors">
            <AvatarImage src={user?.profilePicture || ""} />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
              {user?.username?.slice(0, 1).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 mt-2">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.username || "User"}</p>
              <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                {user?.email || ""}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
              <User size={16} />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleToggleTheme} className="flex items-center gap-2 cursor-pointer">
            {themeMode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {themeMode === "dark" ? "Light Mode" : "Dark Mode"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
          >
            <LogOut size={16} />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
