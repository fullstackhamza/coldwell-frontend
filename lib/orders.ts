import { apiFetch, ApiError } from "./api-client";

export type PaymentMethod = "cod" | "online" | "bank-transfer";

export type ShippingAddress = {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
};

export type OrderItem = {
  productSlug: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
};

export type Order = {
  orderNumber: string;
  items: OrderItem[];
  address: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
  userId: string | null;
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  online: "Online Payment",
  "bank-transfer": "Bank Transfer",
};

/** The normal progression a non-cancelled order moves through. */
export const ORDER_STAGES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
] as const;

/** Display label per stage for the visual tracker (spec calls the first
 * stage "Order Placed" even though the underlying status is "Pending"). */
export const trackerStageLabels: Record<string, string> = {
  Pending: "Order Placed",
  Confirmed: "Confirmed",
  Processing: "Processing",
  Shipped: "Shipped",
  Delivered: "Delivered",
};

export function getStageIndex(status: string): number {
  const index = ORDER_STAGES.indexOf(status as (typeof ORDER_STAGES)[number]);
  return index === -1 ? 0 : index;
}

export type CreateOrderInput = {
  items: {
    productSlug: string;
    size: string;
    color: string;
    quantity: number;
  }[];
  address: ShippingAddress;
  paymentMethod: PaymentMethod;
};

/** Creates the order on the backend. Prices are resolved server-side from
 * the database — nothing about pricing is trusted from the client. Pass a
 * token when the shopper is logged in, so the order is tied to their
 * account (guest checkout still works with no token). */
export async function createOrder(
  input: CreateOrderInput,
  token?: string | null,
): Promise<Order> {
  return apiFetch<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

/** Looks up an order. Pass `phone` for the guest order-tracking flow — it
 * must match the order's phone number or this returns null, same as a
 * genuinely unknown order number. Leave it out for the order-confirmation
 * page, which looks up an order the shopper just placed. */
export async function fetchOrder(
  orderNumber: string,
  phone?: string,
): Promise<Order | null> {
  try {
    const qs = phone ? `?phone=${encodeURIComponent(phone)}` : "";
    return await apiFetch<Order>(`/api/orders/${orderNumber}${qs}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function fetchMyOrders(token: string): Promise<Order[]> {
  return apiFetch<Order[]>("/api/orders/mine", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** Admin only. */
export async function fetchAllOrders(token: string): Promise<Order[]> {
  return apiFetch<Order[]>("/api/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** Admin only. */
export async function updateOrderStatus(
  orderNumber: string,
  newStatus: string,
  token: string,
): Promise<Order> {
  return apiFetch<Order>(`/api/orders/${orderNumber}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: newStatus }),
    headers: { Authorization: `Bearer ${token}` },
  });
}
