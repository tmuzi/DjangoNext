"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { AuthActions } from "@/app/auth/utils";
import { removeTokens, getTokens } from "@/app/auth/actions";
import { useRouter } from "next/navigation";

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
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-center">
        <h1 className="text-2xl font-bold mb-4">Hi, {user?.username}!</h1>
        <p className="mb-4">Your account details:</p>
        <ul className="mb-4">
          <li>Username: {user?.username}</li>
          <li>Email: {user?.email}</li>
        </ul>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? "Logging out..." : "Disconnect"}
        </button>
      </div>
    </div>
  );
}