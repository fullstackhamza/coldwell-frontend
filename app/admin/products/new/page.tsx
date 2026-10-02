import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Admin — Add Product" };

export default function NewProductPage() {
  return (
    <AdminGuard>
      <AdminNav />
      <ProductForm />
    </AdminGuard>
  );
}
