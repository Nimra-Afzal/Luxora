import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";

import ThemeWatcher from "@/components/ThemeWatcher";
import Navbar from "@/components/Navbar";  
import Footer from "@/components/Footer";  

export const metadata: Metadata = {
  title: "Promptopia",
  description: "Discover & Share AI Prompts",
  generator: "v0.app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ✅ Global theme classes applied here */}
      <body className="transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        <Providers>
          <ThemeWatcher />
          <div className="flex flex-col min-h-screen">
            <Navbar /> 
            

            {/* ✅ children will always inherit the theme */}
            <main className="flex-grow">{children}</main>
            <Footer /> 
          </div>
          <Toaster />
        </Providers>
           

      </body>
    </html>
  );
}
