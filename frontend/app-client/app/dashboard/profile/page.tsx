"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthActions, getErrorMessage } from "@/app/auth/utils";
import { getTokens } from "@/app/auth/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "@/app/components/Loading";

type FormData = {
  username: string;
  email: string;
};

interface User {
  username: string;
  email: string;
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activationMessage, setActivationMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormData>();

  const { updateProfile, getMe } = AuthActions();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { accessToken } = await getTokens();
        if (!accessToken) {
          router.push("/auth/login");
          return;
        }

        const user = await getMe(accessToken).json<User>();
        reset({
          username: user.username,
          email: user.email,
        });
      } catch {
        router.push("/auth/login");
      } finally {
        setIsFetching(false);
      }
    };

    fetchUser();
  }, [reset, router]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setIsSuccess(false);
    setActivationMessage("");
    try {
      const { accessToken } = await getTokens();
      if (!accessToken) {
        router.push("/auth/login");
        return;
      }

      await updateProfile(
        { username: data.username, email: data.email },
        accessToken
      ).res();

      setIsSuccess(true);
      // Show activation message if email was changed
      setActivationMessage(
        "If you changed your email, please check your new inbox to activate your new email address."
      );
    } catch (err) {
      setError("root", {
        type: "manual",
        message: getErrorMessage(err),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <h1 className="mb-2 text-center text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Edit Profile
        </h1>
        <p className="mb-8 text-center text-zinc-600 dark:text-zinc-400">
          Update your account information
        </p>

        {isSuccess && (
          <div className="mb-6 rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
            Profile updated successfully!
          </div>
        )}
        {activationMessage && (
          <div className="mb-6 rounded-md bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            {activationMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
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
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.email.message}
              </span>
            )}
          </div>

          <button
            disabled={isLoading}
            className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>

          {errors.root && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {errors.root.message}
            </div>
          )}
        </form>

        <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-700">
          <Link
            href="/auth/change-password"
            className="block w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-center font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Change Password
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <Link
            href="/dashboard"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            ← Back to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
