import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthActions, getErrorMessage } from "@/app/auth/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormData = {
  email: string;
  username: string;
  password: string;
};

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const router = useRouter();

  const { register: registerUser } = AuthActions();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSuccessMessage("");
    try {
      await registerUser(data.email, data.username, data.password).res();
      setSuccessMessage(
        "Account created! Please check your email to activate your account before logging in."
      );
      setTimeout(() => {
        router.push("/auth/login");
      }, 4000);
    } catch (err) {
      setError("root", {
        type: "manual",
        message: getErrorMessage(err),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <h1 className="mb-2 text-center text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Create Account
        </h1>
        <p className="mb-8 text-center text-zinc-600 dark:text-zinc-400">
          Sign up for a new account
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
              className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.email.message}
              </span>
            )}
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Username
            </label>
            <input
              type="text"
              placeholder="johndoe"
              {...register("username", { required: "Username is required" })}
              className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              disabled={isLoading}
            />
            {errors.username && (
              <span className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.username.message}
              </span>
            )}
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
              className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              disabled={isLoading}
            />
            {errors.password && (
              <span className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.password.message}
              </span>
            )}
          </div>
          
          <button 
            disabled={isLoading}
            className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
          
          {successMessage && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
              {successMessage}
            </div>
          )}
          {errors.root && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {errors.root.message}
            </div>
          )}
        </form>
        
        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;