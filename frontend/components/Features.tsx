"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

export default function Features() {
  const theme = useSelector((state: RootState) => state.theme.mode)

  return (
    <section
      className={`py-16 transition-colors duration-300 border-b ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-slate-100 border-gray-200"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2
          className={`text-4xl font-bold text-center mb-12 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Why Shop With Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div
            className={`p-8 rounded-xl shadow-lg text-center transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              theme === "dark"
                ? "bg-gray-700 border border-gray-600"
                : "bg-white border border-gray-200"
            }`}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-pink-600" : "bg-pink-100"
              }`}
            >
              <svg
                className={`w-8 h-8 ${theme === "dark" ? "text-white" : "text-pink-600"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-4a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3
              className={`text-xl font-semibold mb-3 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Wide Variety
            </h3>
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              From fashion to lifestyle, explore thousands of products tailored
              to your needs.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            className={`p-8 rounded-xl shadow-lg text-center transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              theme === "dark"
                ? "bg-gray-700 border border-gray-600"
                : "bg-white border border-gray-200"
            }`}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-green-600" : "bg-green-100"
              }`}
            >
              <svg
                className={`w-8 h-8 ${theme === "dark" ? "text-white" : "text-green-600"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zm0 2c-4.418 0-8 1.79-8 4v3h16v-3c0-2.21-3.582-4-8-4z"
                />
              </svg>
            </div>
            <h3
              className={`text-xl font-semibold mb-3 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Secure Shopping
            </h3>
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Shop with confidence using safe payments and reliable checkout
              options.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            className={`p-8 rounded-xl shadow-lg text-center transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              theme === "dark"
                ? "bg-gray-700 border border-gray-600"
                : "bg-white border border-gray-200"
            }`}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-blue-600" : "bg-blue-100"
              }`}
            >
              <svg
                className={`w-8 h-8 ${theme === "dark" ? "text-white" : "text-blue-600"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h2l1 9h12l1-9h2M5 6h14l-1 4H6L5 6z"
                />
              </svg>
            </div>
            <h3
              className={`text-xl font-semibold mb-3 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Fast Delivery
            </h3>
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Enjoy quick, reliable, and hassle-free delivery right to your
              doorstep.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
