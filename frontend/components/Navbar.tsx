"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
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
          <Link
            href="/about"
            className="relative group text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300 hover:text-blue-600 dark:hover:text-pink-400"
          >
            About Us
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            href="/contact"
            className="relative group text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300 hover:text-blue-600 dark:hover:text-pink-400"
          >
            Contact Us
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Auth Buttons */}
          <Link
            href="/signup"
            className="px-4 py-2 rounded-lg font-semibold shadow transition duration-300 bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:opacity-90 dark:from-pink-400 dark:to-rose-500"
          >
            Signup
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg font-semibold shadow transition duration-300 bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:opacity-90 dark:from-indigo-400 dark:to-blue-500"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
