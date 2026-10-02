"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchMyOrders, paymentMethodLabels, type Order } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

export function OrderHistoryContent() {
  const { user, token, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchMyOrders(token).then(setOrders);
  }, [token]);

  if (authLoading) {
    return <div className="container-page py-24" />;
  }

  if (!user) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <h1 className="font-display text-3xl text-ink">My Orders</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Log in to see your order history.
        </p>
        <Link
          href="/login?next=/account/orders"
          className="mt-6 bg-ink px-7 py-3 text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-14 md:py-20">
      <h1 className="font-display text-3xl text-ink">My Orders</h1>

      {orders === null ? (
        <div className="py-16" />
      ) : orders.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-ink-soft">
            You haven't placed any orders yet.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-block border-b border-ink text-sm text-ink transition hover:border-oxblood hover:text-oxblood"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col divide-y divide-line border-y border-line">
          {orders.map((order) => (
            <div key={order.orderNumber} className="flex flex-col gap-3 py-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-ink">#{order.orderNumber}</p>
                  <p className="text-xs text-ink-soft">
                    {new Date(order.createdAt).toLocaleDateString("en-PK", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    · {paymentMethodLabels[order.paymentMethod]}
                  </p>
                </div>
                <span className="border border-line px-3 py-1 text-xs uppercase tracking-wide text-ink">
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-ink-soft">
                {order.items.map((i) => i.name).join(", ")}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink">
                  {formatPrice(order.total)}
                </span>
                <Link
                  href={`/order-confirmation/${order.orderNumber}`}
                  className="border-b border-ink text-sm text-ink transition hover:border-oxblood hover:text-oxblood"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
