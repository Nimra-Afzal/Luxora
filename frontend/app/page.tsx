"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import LandingBlogs from "@/components/LandingBlogs";
import LandingProducts from "@/components/LandingProducts";

export default function Home() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("from") === "detail") {
      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [searchParams]);

  return (
    <>
      <Hero />
      <Features />
      <LandingProducts />
      <LandingBlogs />
    </>
  );
}
