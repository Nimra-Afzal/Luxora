"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Target,
  Heart,
  Users,
  Award,
  ShoppingBag,
  Truck,
  Shield,
  Headphones,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const stats = [
    { value: "10K+", label: "Products", icon: ShoppingBag },
    { value: "50K+", label: "Happy Customers", icon: Users },
    { value: "100+", label: "Brands", icon: Award },
    { value: "24/7", label: "Support", icon: Headphones },
  ];

  const values = [
    {
      icon: Target,
      title: "Quality First",
      description:
        "We curate only the finest products from trusted brands, ensuring every purchase meets our high standards.",
      color: "blue",
    },
    {
      icon: Heart,
      title: "Customer Love",
      description:
        "Your satisfaction is our priority. We go above and beyond to make your shopping experience exceptional.",
      color: "red",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "Shop with confidence knowing your data is protected and every transaction is secure.",
      color: "green",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Get your orders delivered quickly and reliably, right to your doorstep.",
      color: "purple",
    },
  ];

  const team = [
    { name: "Sarah Johnson", role: "Founder & CEO", image: null },
    { name: "Michael Chen", role: "Head of Operations", image: null },
    { name: "Emily Davis", role: "Creative Director", image: null },
    { name: "James Wilson", role: "Customer Success", image: null },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-8">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">About Us</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              We&apos;re Redefining
              <span className="block text-blue-200">Online Shopping</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Welcome to Luxora - where quality meets convenience. We&apos;re on a mission
              to deliver the best products with exceptional service, making your
              shopping experience truly enjoyable.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  Shop Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <stat.icon size={28} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
                  <ShoppingBag size={64} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
                  <Heart size={48} className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center">
                  <Users size={48} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl flex items-center justify-center">
                  <Award size={64} className="text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Building the Future of E-Commerce
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Founded in 2020, Luxora started with a simple vision: to create an
                  online shopping experience that puts customers first. What began as
                  a small team with big dreams has grown into a thriving marketplace
                  serving thousands of happy customers worldwide.
                </p>
                <p>
                  We believe that shopping should be more than just a transaction.
                  It should be an experience - one filled with discovery, quality,
                  and joy. That&apos;s why we carefully curate every product in our
                  catalog and work tirelessly to provide exceptional service.
                </p>
                <p>
                  Today, we&apos;re proud to partner with over 100 brands to bring you
                  the best products across fashion, electronics, home goods, and more.
                  And we&apos;re just getting started.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What We Stand For
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our core values guide everything we do, from selecting products to
              serving our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                    value.color === "blue"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : value.color === "red"
                      ? "bg-red-100 dark:bg-red-900/30"
                      : value.color === "green"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-purple-100 dark:bg-purple-900/30"
                  }`}
                >
                  <value.icon
                    size={28}
                    className={
                      value.color === "blue"
                        ? "text-blue-600 dark:text-blue-400"
                        : value.color === "red"
                        ? "text-red-600 dark:text-red-400"
                        : value.color === "green"
                        ? "text-green-600 dark:text-green-400"
                        : "text-purple-600 dark:text-purple-400"
                    }
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet the People Behind Luxora
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A dedicated team of professionals passionate about delivering the best
              shopping experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4">
                  <Users size={48} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Luxora has completely changed how I shop online. The quality and service are unmatched!",
                name: "Jessica M.",
                rating: 5,
              },
              {
                quote:
                  "Fast shipping, beautiful products, and amazing customer support. Highly recommended!",
                name: "Robert K.",
                rating: 5,
              },
              {
                quote:
                  "I've been a loyal customer for over a year. Luxora never disappoints with their selection.",
                name: "Amanda T.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  — {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of happy customers and discover the Luxora difference.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                Browse Products
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
