"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function Footer() {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <footer
      className={`py-10 mt-auto transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-600"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1 */}
        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Promptopia
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="#"
                className={`hover:underline ${
                  theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Discover
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`hover:underline ${
                  theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Share
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`hover:underline ${
                  theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Community
              </a>
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Resources
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="#"
                className={`hover:underline ${
                  theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`hover:underline ${
                  theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Guides
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`hover:underline ${
                  theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Follow Us
          </h3>
          <div className="flex space-x-4">
            {["Twitter", "LinkedIn", "GitHub"].map((platform) => (
              <a
                key={platform}
                href="#"
                className={`text-sm ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className={`mt-8 pt-4 text-center text-sm border-t ${
          theme === "dark"
            ? "border-gray-700 text-gray-400"
            : "border-gray-200 text-gray-500"
        }`}
      >
        © {new Date().getFullYear()} Promptopia. All rights reserved.
      </div>
    </footer>
  );
}
