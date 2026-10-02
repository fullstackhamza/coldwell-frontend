import type { Metadata } from "next";
import { ShopListing } from "@/components/shop/ShopListing";
import { fetchProducts } from "@/lib/api/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Sale" };

export default async function SalePage() {
  const products = await fetchProducts({ onSale: true });
  return (
    <ShopListing title="Sale" eyebrow="Limited Time" baseProducts={products} />
  );
}
