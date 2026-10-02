import type { Metadata } from "next";
import { ShopListing } from "@/components/shop/ShopListing";
import { fetchProducts } from "@/lib/api/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Men" };

export default async function MenPage() {
  const products = await fetchProducts({ category: "Men" });
  return <ShopListing title="Men" baseProducts={products} />;
}
