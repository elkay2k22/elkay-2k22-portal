import { clsx } from 'clsx';

/* ── Spinner ──────────────────────────────────────────────────────── */
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
const spinnerSizes = { sm: 'w-4 h-4', md: 'w-7 h-7', lg: 'w-10 h-10' };

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={clsx(
        'inline-block rounded-full border-2 border-gray-200 border-t-primary-600 animate-spin',
        spinnerSizes[size],
        className,
      )}
    />
  );
}

/* ── Full-page loader ─────────────────────────────────────────────── */
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]" aria-label="Loading page">
      <Spinner size="lg" />
    </div>
  );
}

/* ── Skeleton blocks ──────────────────────────────────────────────── */
interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={clsx('skeleton', className)}
    />
  );
}

export function SkeletonCard({ lines = 3 }: SkeletonProps) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 space-y-3">
      <Skeleton className="h-44 w-full rounded-xl" />
      <Skeleton className="h-5 w-3/4 rounded-lg" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={clsx('h-4 rounded-lg', i === lines - 1 ? 'w-1/2' : 'w-full')} />
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 4 }: SkeletonProps) {
  return (
    <div className="space-y-2.5" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={clsx('h-4 rounded', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}

/* ── Empty state ──────────────────────────────────────────────────── */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title = 'Nothing here yet',
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {icon && (
        <span className="mb-4 text-gray-300">{icon}</span>
      )}
      <p className="text-base font-semibold text-gray-700 mb-1">{title}</p>
      {description && <p className="text-sm text-gray-500 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ── Error state ──────────────────────────────────────────────────── */
export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <p className="text-sm text-red-600 font-medium mb-2">
        {message ?? 'Something went wrong.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-primary-600 hover:underline font-medium"
        >
          Try again
        </button>
      )}
    </div>
  );
}
