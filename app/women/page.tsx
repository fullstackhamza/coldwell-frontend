import type { Metadata } from "next";
import { ShopListing } from "@/components/shop/ShopListing";
import { fetchDepartmentProducts } from "@/lib/api/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Women" };

export default async function WomenPage() {
  const products = await fetchDepartmentProducts("Women");
  return <ShopListing title="Women" baseProducts={products} />;
}
