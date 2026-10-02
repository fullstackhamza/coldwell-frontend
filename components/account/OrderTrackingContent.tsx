"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import {
  fetchOrder,
  getStageIndex,
  ORDER_STAGES,
  trackerStageLabels,
  type Order,
} from "@/lib/orders";

const inputClass =
  "border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none";

export function OrderTrackingContent() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await fetchOrder(orderNumber.trim(), phone.trim());
    setOrder(result);
    setSearched(true);
    setLoading(false);
  }

  return (
    <div className="container-page py-14 md:py-20">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-3xl text-ink md:text-4xl">
          Track Your Order
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Enter your order number and the phone number used at checkout.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-4 text-left"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wide text-ink-soft">
              Order Number
            </span>
            <input
              required
              className={inputClass}
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. CO123456"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wide text-ink-soft">
              Phone Number
            </span>
            <input
              required
              className={inputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03XXXXXXXXX"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-ink py-3 text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood disabled:opacity-60"
          >
            {loading ? "Searching…" : "Track Order"}
          </button>
        </form>
      </div>

      {searched && !order && (
        <p className="mt-10 text-center text-sm text-oxblood">
          We couldn't find an order matching that number and phone.
        </p>
      )}

      {order && <OrderTracker order={order} />}
    </div>
  );
}

function OrderTracker({ order }: { order: Order }) {
  if (order.status === "Cancelled") {
    return (
      <div className="mx-auto mt-10 max-w-lg border border-line p-6 text-center">
        <p className="text-sm uppercase tracking-wide text-oxblood">
          Order Cancelled
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Order #{order.orderNumber} was cancelled.
        </p>
      </div>
    );
  }

  const currentStage = getStageIndex(order.status);

  return (
    <div className="mx-auto mt-10 max-w-2xl">
      <p className="text-center text-sm text-ink-soft">
        Order #{order.orderNumber}
      </p>
      <div className="mt-8 flex items-start justify-between">
        {ORDER_STAGES.map((stage, index) => {
          const reached = index <= currentStage;
          const isLast = index === ORDER_STAGES.length - 1;
          return (
            <div key={stage} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${
                    reached
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-ink-soft"
                  }`}
                >
                  {reached ? <Check size={14} strokeWidth={2} /> : index + 1}
                </div>
                {!isLast && (
                  <div
                    className={`h-px flex-1 ${
                      index < currentStage ? "bg-ink" : "bg-line"
                    }`}
                  />
                )}
              </div>
              <span
                className={`mt-2 px-1 text-center text-[11px] uppercase tracking-wide ${
                  reached ? "text-ink" : "text-ink-soft"
                }`}
              >
                {trackerStageLabels[stage]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
