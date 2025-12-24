// "use client";

// import Link from "next/link";
// import ThemeToggle from "./ThemeToggle";

// export default function Navbar() {
//   return (
//     <nav
//       className="
//         border border-black rounded-md p-4 shadow-md
//         bg-gradient-to-r from-white via-sky-50 to-indigo-100
//         dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
//       "
//     >
//       <div className="max-w-screen-xl mx-auto flex items-center justify-between">
//         {/* Brand Name */}
//         <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-pink-500 to-purple-600 bg-clip-text text-transparent tracking-wide">
//           Luxora
//         </span>

//         {/* Links */}
//         <div className="flex items-center space-x-6">
//           {/* 🔥 Home link */}
//           <Link
//             href="/"
//             className="relative group text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300 hover:text-blue-600 dark:hover:text-pink-400"
//           >
//             Home
//             <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
//           </Link>

//           <Link
//             href="/about"
//             className="relative group text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300 hover:text-blue-600 dark:hover:text-pink-400"
//           >
//             About Us
//             <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
//           </Link>

//           <Link
//             href="/contact"
//             className="relative group text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300 hover:text-blue-600 dark:hover:text-pink-400"
//           >
//             Contact Us
//             <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
//           </Link>

//           {/* Theme Toggle */}
//           <ThemeToggle />

//           {/* Auth Buttons */}
//           <Link
//             href="/signup"
//             className="px-4 py-2 rounded-lg font-semibold shadow transition duration-300 bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:opacity-90 dark:from-pink-400 dark:to-rose-500"
//           >
//             Signup
//           </Link>
//           <Link
//             href="/login"
//             className="px-4 py-2 rounded-lg font-semibold shadow transition duration-300 bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:opacity-90 dark:from-indigo-400 dark:to-blue-500"
//           >
//             Login
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { logout } from "@/redux/features/authSlice";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav
      className="
        border border-black rounded-md p-4 shadow-md
        bg-gradient-to-r from-white via-sky-50 to-indigo-100
        dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      "
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Brand Name */}
        <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-pink-500 to-purple-600 bg-clip-text text-transparent tracking-wide">
          Luxora
        </span>

        {/* Links */}
        <div className="flex items-center space-x-6">
          {/* Home */}
          <Link
            href="/"
            className="relative group text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300 hover:text-blue-600 dark:hover:text-pink-400"
          >
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* About */}
          <Link
            href="/about"
            className="relative group text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300 hover:text-blue-600 dark:hover:text-pink-400"
          >
            About Us
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            className="relative group text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300 hover:text-blue-600 dark:hover:text-pink-400"
          >
            Contact Us
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* 🔥 Dynamic User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer border border-gray-400 dark:border-gray-600">
                <AvatarImage src={user?.profilePicture || ""} />
                <AvatarFallback>
                  {user?.username?.slice(0, 1).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mr-4 mt-2 w-44">
              {!isAuthenticated ? (
                <>
                  <DropdownMenuItem>
                    <Link href="/login" className="w-full">
                      Login
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Link href="/signup" className="w-full">
                      Signup
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
  <DropdownMenuItem asChild>
    <Link href="/dashboard/profile" className="w-full">
      Profile
    </Link>
  </DropdownMenuItem>

  <DropdownMenuItem asChild>
    <Link href="/dashboard/settings" className="w-full">
      Settings
    </Link>
  </DropdownMenuItem>

  <DropdownMenuItem onClick={handleLogout}>
    Logout
  </DropdownMenuItem>
</>

              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
