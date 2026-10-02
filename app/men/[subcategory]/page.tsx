import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopListing } from "@/components/shop/ShopListing";
import { fetchProducts } from "@/lib/api/products";
import { getSubcategoryLabel } from "@/lib/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ subcategory: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const label = getSubcategoryLabel("Men", subcategory);
  return { title: label ? `${label} — Men` : "Men" };
}

export default async function MenSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const label = getSubcategoryLabel("Men", subcategory);
  if (!label) notFound();

  const products = await fetchProducts({
    category: "Men",
    subcategory: [label],
  });

  return <ShopListing title={label} eyebrow="Men" baseProducts={products} />;
}
