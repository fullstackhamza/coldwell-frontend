"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "./CartProvider";
import { computeTotals } from "@/lib/cart-utils";
import { formatPrice } from "@/lib/format";
import { CURRENCY, FREE_DELIVERY_THRESHOLD } from "@/lib/site-config";

export function CartPageContent() {
  const { items, removeItem, updateQuantity } = useCart();
  const { subtotal, shipping, total } = computeTotals(items);

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl text-ink">Your cart is empty</h1>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-ink px-7 py-3 text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-display text-3xl text-ink md:text-4xl">Your Cart</h1>

      <div className="mt-8 grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="flex flex-col divide-y divide-line border-y border-line">
            {items.map((item) => (
              <div key={item.key} className="flex gap-4 py-5">
                <Link
                  href={`/product/${item.productSlug}`}
                  className="h-28 w-24 shrink-0 bg-sand"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link href={`/product/${item.productSlug}`}>
                        <h3 className="text-sm text-ink">{item.name}</h3>
                      </Link>
                      <p className="mt-1 text-xs text-ink-soft">
                        Size {item.size} · {item.color}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => removeItem(item.key)}
                      className="h-fit p-1 text-ink-soft transition hover:text-oxblood"
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="inline-flex items-center border border-line">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          updateQuantity(item.key, item.quantity - 1)
                        }
                        className="px-2.5 py-1 text-ink transition hover:bg-sand"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm text-ink">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          updateQuantity(item.key, item.quantity + 1)
                        }
                        className="px-2.5 py-1 text-ink transition hover:bg-sand"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-ink">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/shop"
            className="mt-6 inline-block border-b border-ink text-sm text-ink transition hover:border-oxblood hover:text-oxblood"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="h-fit border border-line p-6">
          <h2 className="text-sm uppercase tracking-wide text-ink">
            Order Summary
          </h2>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span>
              <span className="text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Shipping</span>
              <span className="text-ink">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-ink-soft">
                Free delivery on orders over{" "}
                {CURRENCY} {new Intl.NumberFormat("en-PK").format(FREE_DELIVERY_THRESHOLD)}
              </p>
            )}
            <div className="mt-2 flex justify-between border-t border-line pt-3 text-ink">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block bg-ink py-3.5 text-center text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
