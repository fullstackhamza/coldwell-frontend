import type { Metadata } from "next";
import { ShopListing } from "@/components/shop/ShopListing";
import { fetchProducts } from "@/lib/api/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Best Sellers" };

export default async function BestSellersPage() {
  const products = await fetchProducts({ collection: ["best-sellers"] });
  return <ShopListing title="Best Sellers" baseProducts={products} />;
}
