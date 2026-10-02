import type { Metadata } from "next";
import { ShopListing } from "@/components/shop/ShopListing";
import { fetchProducts } from "@/lib/api/products";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `"${q}" — Search Results` : "Shop" };
}

export default async function ShopPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const products = await fetchProducts(q ? { search: q } : {});
  return (
    <ShopListing
      title={q ? `Results for "${q}"` : "Shop"}
      baseProducts={products}
    />
  );
}
