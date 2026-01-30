"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  const pathname = usePathname();

  // Hide Navbar/Footer on dashboard pages (they have their own Sidebar)
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
