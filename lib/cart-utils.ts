import type { CartItem } from "@/components/cart/CartProvider";
import { FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE } from "./site-config";

export function computeTotals(items: CartItem[]) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping =
    subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : STANDARD_DELIVERY_FEE;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}
