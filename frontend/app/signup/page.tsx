"use client";

import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { signup } from "@/redux/features/authSlice";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SignupForm {
  username: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { register, handleSubmit } = useForm<SignupForm>();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: SignupForm) => {
    const result = await dispatch(signup(data));
    if (signup.fulfilled.match(result)) {
      toast.success("Account created successfully! Please login.");
      router.push("/login");
    } else {
      toast.error(result.payload as string);
      setError(result.payload as string);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 dark:bg-gray-950 transition-colors duration-300">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 p-8 rounded shadow-md w-96 border border-gray-300 dark:border-gray-700 transition-colors duration-300"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Sign Up
        </h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          {...register("username")}
          placeholder="Username"
          className="w-full p-2 mb-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded transition-colors duration-300"
        />
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full p-2 mb-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded transition-colors duration-300"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded transition-colors duration-300"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white p-2 rounded transition-colors duration-300"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
