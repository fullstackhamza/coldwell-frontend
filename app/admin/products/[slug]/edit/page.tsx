import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { ProductForm } from "@/components/admin/ProductForm";
import { fetchProductBySlug } from "@/lib/api/products";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  return { title: product ? `Admin — Edit ${product.name}` : "Admin — Edit Product" };
}

export default async function EditProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  return (
    <AdminGuard>
      <AdminNav />
      <ProductForm initialProduct={product} />
    </AdminGuard>
  );
}
