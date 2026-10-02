"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container-page py-24" />;
  }

  if (!user) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <h1 className="font-display text-3xl text-ink">Admin</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Log in with an admin account to continue.
        </p>
        <Link
          href="/login?next=/admin"
          className="mt-6 bg-ink px-7 py-3 text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood"
        >
          Log In
        </Link>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <h1 className="font-display text-3xl text-ink">Access Denied</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Your account ({user.email}) doesn't have admin access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
