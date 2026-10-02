import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopListing } from "@/components/shop/ShopListing";
import { fetchProducts } from "@/lib/api/products";
import { getSubcategoryLabel } from "@/lib/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ subcategory: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const label = getSubcategoryLabel("Women", subcategory);
  return { title: label ? `${label} — Women` : "Women" };
}

export default async function WomenSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const label = getSubcategoryLabel("Women", subcategory);
  if (!label) notFound();

  const products = await fetchProducts({
    category: "Women",
    subcategory: [label],
  });

  return <ShopListing title={label} eyebrow="Women" baseProducts={products} />;
}
