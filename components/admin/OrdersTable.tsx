"use client";

import { useEffect, useState } from "react";
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

export function OrdersTable() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
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
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-soft">
                <th className="py-2 pr-4 font-normal">Order</th>
                <th className="py-2 pr-4 font-normal">Customer</th>
                <th className="py-2 pr-4 font-normal">Phone</th>
                <th className="py-2 pr-4 font-normal">Payment</th>
                <th className="py-2 pr-4 font-normal">Total</th>
                <th className="py-2 pr-4 font-normal">Date</th>
                <th className="py-2 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderNumber} className="border-b border-line">
                  <td className="py-3 pr-4 text-ink">#{order.orderNumber}</td>
                  <td className="py-3 pr-4 text-ink-soft">
                    {order.address.fullName}
                  </td>
                  <td className="py-3 pr-4 text-ink-soft">
                    {order.address.phone}
                  </td>
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
                  <td className="py-3">
                    <select
                      value={order.status}
                      disabled={updatingOrder === order.orderNumber}
                      onChange={(e) =>
                        handleStatusChange(order.orderNumber, e.target.value)
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
