import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthActions, getErrorMessage } from "@/app/auth/utils";
import { storeTokens } from "@/app/auth/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormData = {
  username: string;
  password: string;
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const router = useRouter();

  const { login } = AuthActions();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const json = await login(data.username, data.password).json<{
        access: string;
        refresh: string;
      }>();
      
      // Store tokens securely via server action
      await storeTokens(json.access, json.refresh);
      
      router.push("/dashboard");
    } catch (err) {
      setError("root", { 
        type: "manual", 
        message: getErrorMessage(err) 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <h1 className="mb-2 text-center text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Welcome Back
        </h1>
        <p className="mb-8 text-center text-zinc-600 dark:text-zinc-400">
          Sign in to your account
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })}
              className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              disabled={isLoading}
            />
            {errors.username && (
              <span className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.username.message}</span>
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
              <span className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</span>
            )}
          </div>
          
          <button 
            disabled={isLoading}
            className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
          
          {errors.root && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {errors.root.message}
            </div>
          )}
        </form>
        
        <div className="mt-6 text-center">
          <Link
            href="/auth/password/reset-password"
            className="text-sm text-zinc-400 dark:text-zinc-500"
          >
            Forgot password? (Coming soon)
          </Link>
        </div>
        <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;