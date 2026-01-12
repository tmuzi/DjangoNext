interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const Loading = ({ message = "Loading...", fullScreen = true }: LoadingProps) => {
  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-zinc-600 dark:text-zinc-400">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-zinc-600 dark:text-zinc-400">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
