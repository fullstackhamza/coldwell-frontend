import type { Metadata } from "next";
import { ShopListing } from "@/components/shop/ShopListing";
import { fetchProducts } from "@/lib/api/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Thrift" };

export default async function ThriftPage() {
  const products = await fetchProducts({ collection: ["thrift"] });
  return <ShopListing title="Thrift — One of a Kind" baseProducts={products} />;
}
