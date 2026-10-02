"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchProducts } from "@/lib/api/products";
import { fetchAllOrders } from "@/lib/orders";

export function DashboardContent() {
  const { token, user } = useAuth();
  const [productCount, setProductCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts().then((products) => setProductCount(products.length));
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchAllOrders(token).then((orders) => {
      setOrderCount(orders.length);
      setPendingCount(orders.filter((o) => o.status === "Pending").length);
    });
  }, [token]);

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl text-ink">
        Welcome{user ? `, ${user.fullName}` : ""}
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Products" value={productCount} href="/admin/products" />
        <StatCard label="Total Orders" value={orderCount} href="/admin/orders" />
        <StatCard
          label="Pending Orders"
          value={pendingCount}
          href="/admin/orders"
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number | null;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="border border-line p-6 transition hover:border-ink"
    >
      <p className="text-xs uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-2 font-display text-4xl text-ink">
        {value === null ? "—" : value}
      </p>
    </Link>
  );
}
