"use client";

import { Fragment, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  fetchAllOrders,
  updateOrderStatus,
  ORDER_STAGES,
  paymentMethodLabels,
  type Order,
} from "@/lib/orders";
import { formatPrice } from "@/lib/format";

const ALL_STATUSES = [...ORDER_STAGES, "Cancelled"];

// Customer-typed text goes into the print window, so escape it first.
function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[c];
  });
}

function addressText(order: Order) {
  const a = order.address;
  return [
    a.fullName,
    a.street,
    `${a.city}, ${a.province} ${a.postalCode}`,
    a.phone,
  ].join("\n");
}

function printSlip(order: Order) {
  const w = window.open("", "_blank", "width=720,height=900");
  if (!w) return;
  const a = order.address;
  const rows = order.items
    .map(
      (i) =>
        `<tr>
          <td>${escapeHtml(i.name)}</td>
          <td>${escapeHtml(i.size)} / ${escapeHtml(i.color)}</td>
          <td style="text-align:right">${i.quantity}</td>
          <td style="text-align:right">${escapeHtml(formatPrice(i.price))}</td>
        </tr>`,
    )
    .join("");

  w.document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Order ${escapeHtml(order.orderNumber)}</title>
<style>
  body { font-family: Arial, sans-serif; color: #111; padding: 28px; font-size: 14px; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  h2 { font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: #555; margin: 22px 0 6px; }
  p { margin: 2px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  th, td { text-align: left; padding: 8px 6px; border-bottom: 1px solid #ddd; }
  th { font-size: 12px; color: #555; font-weight: normal; }
  .totals { margin-top: 12px; text-align: right; }
</style>
</head>
<body>
  <h1>Coldwell - Order #${escapeHtml(order.orderNumber)}</h1>
  <p>${escapeHtml(new Date(order.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" }))}</p>

  <h2>Deliver to</h2>
  <p><strong>${escapeHtml(a.fullName)}</strong></p>
  <p>${escapeHtml(a.street)}</p>
  <p>${escapeHtml(a.city)}, ${escapeHtml(a.province)} ${escapeHtml(a.postalCode)}</p>
  <p>Phone: ${escapeHtml(a.phone)}</p>
  <p>Email: ${escapeHtml(a.email)}</p>

  <h2>Items</h2>
  <table>
    <thead><tr><th>Product</th><th>Size / Color</th><th style="text-align:right">Qty</th><th style="text-align:right">Price</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="totals">
    <p>Subtotal: ${escapeHtml(formatPrice(order.subtotal))}</p>
    <p>Shipping: ${escapeHtml(formatPrice(order.shipping))}</p>
    <p><strong>Total: ${escapeHtml(formatPrice(order.total))}</strong></p>
    <p>Payment: ${escapeHtml(paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod)}</p>
  </div>
</body>
</html>`);
  w.document.close();
  w.focus();
  w.print();
}

export function OrdersTable() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [copiedOrder, setCopiedOrder] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchAllOrders(token).then(setOrders);
  }, [token]);

  async function handleStatusChange(orderNumber: string, newStatus: string) {
    if (!token) return;
    setError(null);
    setUpdatingOrder(orderNumber);
    try {
      const updated = await updateOrderStatus(orderNumber, newStatus, token);
      setOrders(
        (prev) =>
          prev?.map((o) =>
            o.orderNumber === orderNumber ? updated : o,
          ) ?? null,
      );
    } catch {
      setError("Couldn't update that order's status. Please try again.");
    } finally {
      setUpdatingOrder(null);
    }
  }

  async function handleCopy(order: Order) {
    try {
      await navigator.clipboard.writeText(addressText(order));
      setCopiedOrder(order.orderNumber);
      setTimeout(() => setCopiedOrder(null), 2000);
    } catch {
      setError("Couldn't copy the address. Please select and copy it by hand.");
    }
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl text-ink">Orders</h1>

      {error && <p className="mt-4 text-sm text-oxblood">{error}</p>}

      {orders === null ? (
        <div className="py-16" />
      ) : orders.length === 0 ? (
        <p className="mt-10 text-sm text-ink-soft">No orders yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-soft">
                <th className="py-2 pr-4 font-normal">Order</th>
                <th className="py-2 pr-4 font-normal">Customer</th>
                <th className="py-2 pr-4 font-normal">Phone</th>
                <th className="py-2 pr-4 font-normal">Payment</th>
                <th className="py-2 pr-4 font-normal">Total</th>
                <th className="py-2 pr-4 font-normal">Date</th>
                <th className="py-2 pr-4 font-normal">Status</th>
                <th className="py-2 font-normal">Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isOpen = openOrder === order.orderNumber;
                const a = order.address;
                return (
                  <Fragment key={order.orderNumber}>
                    <tr className="border-b border-line">
                      <td className="py-3 pr-4 text-ink">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3 pr-4 text-ink-soft">{a.fullName}</td>
                      <td className="py-3 pr-4 text-ink-soft">{a.phone}</td>
                      <td className="py-3 pr-4 text-ink-soft">
                        {paymentMethodLabels[order.paymentMethod]}
                      </td>
                      <td className="py-3 pr-4 text-ink">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3 pr-4 text-ink-soft">
                        {new Date(order.createdAt).toLocaleDateString("en-PK", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 pr-4">
                        <select
                          value={order.status}
                          disabled={updatingOrder === order.orderNumber}
                          onChange={(e) =>
                            handleStatusChange(
                              order.orderNumber,
                              e.target.value,
                            )
                          }
                          className="border border-line bg-paper px-2 py-1.5 text-xs uppercase tracking-wide text-ink disabled:opacity-50"
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() =>
                            setOpenOrder(isOpen ? null : order.orderNumber)
                          }
                          className="text-xs uppercase tracking-wide text-ink underline underline-offset-4 transition hover:text-oxblood"
                        >
                          {isOpen ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>

                    {isOpen && (
                      <tr className="border-b border-line">
                        <td colSpan={8} className="py-6">
                          <div className="grid gap-8 md:grid-cols-3">
                            <div>
                              <h3 className="text-xs uppercase tracking-wide text-ink-soft">
                                Deliver to
                              </h3>
                              <p className="mt-2 text-ink">{a.fullName}</p>
                              <p className="text-ink-soft">{a.street}</p>
                              <p className="text-ink-soft">
                                {a.city}, {a.province} {a.postalCode}
                              </p>
                              <div className="mt-4 flex flex-wrap gap-4">
                                <button
                                  type="button"
                                  onClick={() => handleCopy(order)}
                                  className="text-xs uppercase tracking-wide text-ink underline underline-offset-4 transition hover:text-oxblood"
                                >
                                  {copiedOrder === order.orderNumber
                                    ? "Copied"
                                    : "Copy address"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => printSlip(order)}
                                  className="text-xs uppercase tracking-wide text-ink underline underline-offset-4 transition hover:text-oxblood"
                                >
                                  Print packing slip
                                </button>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-xs uppercase tracking-wide text-ink-soft">
                                Contact
                              </h3>
                              <p className="mt-2">
                                <a
                                  href={`tel:${a.phone}`}
                                  className="text-ink underline underline-offset-4 hover:text-oxblood"
                                >
                                  {a.phone}
                                </a>
                              </p>
                              <p className="mt-1 break-all">
                                <a
                                  href={`mailto:${a.email}`}
                                  className="text-ink-soft underline underline-offset-4 hover:text-oxblood"
                                >
                                  {a.email}
                                </a>
                              </p>
                              <p className="mt-4 text-ink-soft">
                                Payment:{" "}
                                <span className="text-ink">
                                  {paymentMethodLabels[order.paymentMethod]}
                                </span>
                              </p>
                            </div>

                            <div>
                              <h3 className="text-xs uppercase tracking-wide text-ink-soft">
                                Items
                              </h3>
                              <ul className="mt-2 flex flex-col gap-3">
                                {order.items.map((item, idx) => (
                                  <li
                                    key={`${item.productSlug}-${item.size}-${item.color}-${idx}`}
                                    className="flex justify-between gap-4"
                                  >
                                    <span>
                                      <span className="block text-ink">
                                        {item.name}
                                      </span>
                                      <span className="block text-ink-soft">
                                        Size {item.size} · {item.color}
                                      </span>
                                    </span>
                                    <span className="whitespace-nowrap text-right text-ink-soft">
                                      {item.quantity} × {formatPrice(item.price)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-4 border-t border-line pt-3 text-ink-soft">
                                <p className="flex justify-between">
                                  <span>Subtotal</span>
                                  <span>{formatPrice(order.subtotal)}</span>
                                </p>
                                <p className="flex justify-between">
                                  <span>Shipping</span>
                                  <span>{formatPrice(order.shipping)}</span>
                                </p>
                                <p className="mt-1 flex justify-between text-ink">
                                  <span>Total</span>
                                  <span>{formatPrice(order.total)}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
