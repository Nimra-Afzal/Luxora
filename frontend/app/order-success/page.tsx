"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Package, Truck, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage() {
  const [orderNumber] = useState(() =>
    `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        {/* Order Number */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Order Number</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{orderNumber}</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
              <Mail size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Confirmation email sent
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
              <Package size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Preparing your order
            </p>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
            <Truck size={20} />
            <span className="font-medium">Estimated delivery: 5-7 business days</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button variant="outline" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              View Orders
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
