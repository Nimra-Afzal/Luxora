"use client";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { login, setUserFromStorage } from "@/redux/features/authSlice";
import { toast } from "sonner";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>();
  const [localError, setLocalError] = useState<string | null>(null);

  const { loading, error } = useSelector((state: RootState) => state.auth);

  // ✅ Only restore user state, but don't redirect
  useEffect(() => {
    dispatch(setUserFromStorage());
  }, [dispatch]);

  const onSubmit = async (data: LoginForm) => {
    setLocalError(null);
    try {
      const result = await dispatch(login(data)).unwrap();
      toast.success("Logged in successfully!");
      router.push("/dashboard"); // ✅ redirect only here
    } catch (err: any) {
      toast.error(err || "Login failed");
      setLocalError(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 dark:bg-gray-950 transition-colors duration-300">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 p-8 rounded shadow-md w-96 border border-gray-300 dark:border-gray-700 transition-colors duration-300"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Login
        </h2>
        {(localError || error) && (
          <p className="text-red-500 mb-2">{localError || error}</p>
        )}
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
          disabled={loading}
          className={`w-full p-2 rounded text-white transition ${
            loading
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
