"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900 text-center">
          <div className="mb-4 text-6xl">🚧</div>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Under Construction
          </h1>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            Password reset functionality is currently being worked on. Please check back later.
          </p>
          <Link
            href="/auth/login"
            className="inline-block rounded-md bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}