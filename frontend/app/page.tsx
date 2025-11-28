"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import LandingBlogs from "@/components/LandingBlogs";
import LandingProducts from "@/components/LandingProducts";
import { RootState } from "@/redux/store";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (searchParams.get("from") === "detail") {
      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [searchParams]);

  const handleProtectedAction = () => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <Hero />
      <Features />
      <LandingProducts />
      <LandingBlogs />
      <div className="flex justify-center mt-3 mb-3">
        <button
          onClick={handleProtectedAction}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </>
  );
}
