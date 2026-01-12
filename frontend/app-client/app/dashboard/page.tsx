"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { AuthActions } from "@/app/auth/utils";
import { removeTokens, getTokens } from "@/app/auth/actions";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading";

interface User {
  username: string;
  email: string;
}

export default function Home() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: user, isLoading } = useSWR("/auth/users/me", fetcher<User>);

  const { logout } = AuthActions();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { refreshToken } = await getTokens();
      if (refreshToken) {
        await logout(refreshToken).res();
      }
    } catch {
      // Continue with logout even if API call fails
    } finally {
      await removeTokens();
      router.push("/auth/login");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <h1 className="mb-2 text-center text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Welcome back, {user?.username}!
        </h1>
        <p className="mb-8 text-center text-zinc-600 dark:text-zinc-400">
          {user?.email}
        </p>

        <div className="mb-6 rounded-md bg-zinc-100 p-4 dark:bg-zinc-800">
          <h2 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Account Details
          </h2>
          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              <span className="font-medium">Username:</span> {user?.username}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}