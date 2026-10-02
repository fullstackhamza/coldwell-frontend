import { CURRENCY } from "./site-config";

export function formatPrice(amount: number): string {
  return `${CURRENCY} ${new Intl.NumberFormat("en-PK").format(amount)}`;
}

/** Returns a whole-number percentage off, or null if the item isn't on sale */
export function discountPercent(
  price: number,
  compareAtPrice?: number,
): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
