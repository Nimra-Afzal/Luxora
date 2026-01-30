import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

import ThemeWatcher from "@/components/ThemeWatcher";
import MainLayout from "@/components/MainLayout";

export const metadata: Metadata = {
  title: "Luxora",
  description: "Discover & Shop Premium Products",
  generator: "v0.app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        <Providers>
          <ThemeWatcher />
          <MainLayout>{children}</MainLayout>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}

