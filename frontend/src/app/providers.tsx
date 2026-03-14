import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/admin/store/authStore';

/* ── Auth guard ──────────────────────────────────────────────────────────── */
export function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

/* ── App providers ───────────────────────────────────────────────────────── */
export function Providers({ children }: { children: ReactNode }) {
  // Add future providers here: React Query, theme context, etc.
  return <>{children}</>;
}
