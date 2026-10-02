"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { ApiError } from "@/lib/api-client";

const inputClass =
  "border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none";

export function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await signup(fullName, email, password);
      router.push(searchParams.get("next") || "/account");
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 409
          ? "An account with this email already exists."
          : "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page flex justify-center py-16 md:py-24">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-ink">Create an Account</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Already have one?{" "}
          <Link href="/login" className="text-ink underline underline-offset-4">
            Log in
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wide text-ink-soft">
              Full Name
            </span>
            <input
              required
              className={inputClass}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wide text-ink-soft">
              Email
            </span>
            <input
              type="email"
              required
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wide text-ink-soft">
              Password
            </span>
            <input
              type="password"
              required
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wide text-ink-soft">
              Confirm Password
            </span>
            <input
              type="password"
              required
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>

          {error && <p className="text-xs text-oxblood">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full bg-ink py-3 text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood disabled:opacity-60"
          >
            {submitting ? "Creating Account…" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
