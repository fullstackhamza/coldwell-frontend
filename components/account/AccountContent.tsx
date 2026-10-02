"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

export function AccountContent() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="container-page py-24" />;
  }

  if (!user) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <h1 className="font-display text-3xl text-ink">My Account</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Log in to see your account and order history.
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            href="/login?next=/account"
            className="bg-ink px-7 py-3 text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood"
          >
            Log In
          </Link>
          <Link
            href="/signup?next=/account"
            className="border border-ink px-7 py-3 text-sm uppercase tracking-wide text-ink transition hover:border-oxblood hover:text-oxblood"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-14 md:py-20">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl text-ink">My Account</h1>
        <div className="mt-6 border border-line p-6">
          <p className="text-xs uppercase tracking-wide text-ink-soft">Name</p>
          <p className="mt-1 text-ink">{user.fullName}</p>
          <p className="mt-4 text-xs uppercase tracking-wide text-ink-soft">
            Email
          </p>
          <p className="mt-1 text-ink">{user.email}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/account/orders"
            className="border border-ink px-6 py-3 text-center text-sm uppercase tracking-wide text-ink transition hover:border-oxblood hover:text-oxblood"
          >
            My Orders
          </Link>
          <button
            type="button"
            onClick={logout}
            className="py-3 text-center text-sm uppercase tracking-wide text-ink-soft transition hover:text-oxblood"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
