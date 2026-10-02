"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { fetchOrder, paymentMethodLabels, type Order } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { useAuth } from "@/components/auth/AuthProvider";

export function OrderConfirmationContent({
  orderNumber,
}: {
  orderNumber: string;
}) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    fetchOrder(orderNumber).then((result) => {
      if (!cancelled) setOrder(result);
    });
    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  // Still fetching from the backend
  if (order === undefined) {
    return <div className="container-page py-24" />;
  }

  if (order === null) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl text-ink">
          We couldn't find that order
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          The order number may be incorrect.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-ink px-7 py-3 text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-14 md:py-20">
      <div className="mx-auto max-w-xl text-center">
        <CheckCircle2
          size={40}
          strokeWidth={1.5}
          className="mx-auto text-oxblood"
        />
        <h1 className="mt-4 font-display text-3xl text-ink md:text-4xl">
          Order Confirmed
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Thank you for your order! We've sent a confirmation to{" "}
          {order.address.email}.
        </p>
        <p className="mt-4 text-sm uppercase tracking-wide text-ink">
          Order Number: <span className="text-oxblood">#{order.orderNumber}</span>
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-xl border border-line p-6">
        <h2 className="text-sm uppercase tracking-wide text-ink">
          Order Details
        </h2>
        <div className="mt-4 flex flex-col divide-y divide-line">
          {order.items.map((item, index) => (
            <div
              key={`${item.productSlug}-${item.size}-${item.color}-${index}`}
              className="flex justify-between gap-3 py-3 text-sm first:pt-0"
            >
              <div>
                <p className="text-ink">
                  {item.name} × {item.quantity}
                </p>
                <p className="text-xs text-ink-soft">
                  Size {item.size} · {item.color}
                </p>
              </div>
              <span className="shrink-0 text-ink">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-2 flex flex-col gap-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>Subtotal</span>
            <span className="text-ink">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-soft">
            <span>Delivery Fee</span>
            <span className="text-ink">
              {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
            </span>
          </div>
          <div className="mt-2 flex justify-between border-t border-line pt-3 text-ink">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-line pt-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-soft">
              Delivery Address
            </p>
            <p className="mt-1 text-ink">{order.address.fullName}</p>
            <p className="text-ink-soft">
              {order.address.street}, {order.address.city}
            </p>
            <p className="text-ink-soft">
              {order.address.province} {order.address.postalCode}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-soft">
              Payment Method
            </p>
            <p className="mt-1 text-ink">
              {paymentMethodLabels[order.paymentMethod]}
            </p>
            <p className="mt-3 text-xs uppercase tracking-wide text-ink-soft">
              Estimated Delivery
            </p>
            <p className="mt-1 text-ink">3–5 business days</p>
          </div>
        </div>
      </div>

      {!user && (
        <div className="mx-auto mt-6 max-w-xl border border-line bg-sand/40 p-4 text-center">
          <p className="text-sm text-ink">
            Create an account to track this and future orders.
          </p>
          <Link
            href={`/signup?next=/order-confirmation/${order.orderNumber}`}
            className="mt-2 inline-block border-b border-ink text-sm text-ink transition hover:border-oxblood hover:text-oxblood"
          >
            Create Account
          </Link>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/shop"
          className="border-b border-ink text-sm text-ink transition hover:border-oxblood hover:text-oxblood"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
