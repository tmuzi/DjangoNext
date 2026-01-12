"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";

const HelloWorld = () => {
  const router = useRouter();

  //const { data: message } = useSWR("/api/hello", fetcher);
  const message = "Comming Soon!!";

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <div className="flex flex-col items-center gap-6 sm:items-start sm:text-left">
                <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                    Hello World from Next.js App Router!
                </h1>
                <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                    Here is a message from the API: {message}. (Test /dashboard for auth!!!)
                </p>
            </div>
        </div>
    );
}

export default HelloWorld;