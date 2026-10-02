import type { Metadata } from "next";
import { ShopListing } from "@/components/shop/ShopListing";
import { fetchProducts } from "@/lib/api/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "New Arrivals" };

export default async function NewArrivalsPage() {
  const products = await fetchProducts({ collection: ["new-arrivals"] });
  return <ShopListing title="New Arrivals" baseProducts={products} />;
}
