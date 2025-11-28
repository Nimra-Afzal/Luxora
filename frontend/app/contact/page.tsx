"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(1, "Message is required"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log("📩 Sending data to API:", data);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("🔍 API Response status:", res.status);

      if (!res.ok) throw new Error("Failed to submit");

      toast.success("Message sent successfully ✅");
      reset();
    } catch (err) {
      console.error("❌ API Error:", err);
      toast.error("Something went wrong ❌");
    }
  };

  return (
    <main className="bg-blue-50 dark:bg-gray-950 min-h-screen flex items-center justify-center transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 border border-gray-300 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">
          Contact Us
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          We'd love to hear from you! Fill out the form below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            {...register("name")}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          <input
            type="email"
            placeholder="Your Email"
            {...register("email")}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-2"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <textarea
            placeholder="Your Message"
            rows={4}
            {...register("message")}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-2"
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 transition"
          >
            SEND
          </button>
        </form>
      </div>
    </main>
  );
}
