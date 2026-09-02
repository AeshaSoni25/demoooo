import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12",
        className
      )}
      role="status"
      aria-label={message}
    >
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  className?: string;
}

export function ErrorState({ message = "Something went wrong.", className }: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-12",
        className
      )}
      role="alert"
    >
      <div className="text-2xl">⚠️</div>
      <p className="text-sm text-red-400">{message}</p>
    </div>
  );
}

interface EmptyStateProps {
  message?: string;
  icon?: string;
  className?: string;
}

export function EmptyState({
  message = "No data available.",
  icon = "📭",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-12",
        className
      )}
    >
      <div className="text-3xl">{icon}</div>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

// Skeleton card
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-700/40 bg-slate-800/40 p-4 animate-pulse",
        className
      )}
      aria-hidden="true"
    >
      <div className="h-3 bg-slate-700 rounded w-1/3 mb-3" />
      <div className="h-7 bg-slate-700 rounded w-1/2 mb-2" />
      <div className="h-2 bg-slate-700/60 rounded w-full mb-1" />
      <div className="h-2 bg-slate-700/60 rounded w-2/3" />
    </div>
  );
}
