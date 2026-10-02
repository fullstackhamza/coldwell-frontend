"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { ApiError } from "@/lib/api-client";

const inputClass =
  "border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push(searchParams.get("next") || "/account");
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? "Incorrect email or password."
          : "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page flex justify-center py-16 md:py-24">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-ink">Log In</h1>
        <p className="mt-2 text-sm text-ink-soft">
          New here?{" "}
          <Link href="/signup" className="text-ink underline underline-offset-4">
            Create an account
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
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
              autoComplete="current-password"
            />
          </label>

          {error && <p className="text-xs text-oxblood">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full bg-ink py-3 text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood disabled:opacity-60"
          >
            {submitting ? "Logging In…" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
