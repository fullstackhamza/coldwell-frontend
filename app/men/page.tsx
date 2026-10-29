import type { Metadata } from "next";
import { ShopListing } from "@/components/shop/ShopListing";
import { fetchDepartmentProducts } from "@/lib/api/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Men" };

export default async function MenPage() {
  const products = await fetchDepartmentProducts("Men");
  return <ShopListing title="Men" baseProducts={products} />;
}
