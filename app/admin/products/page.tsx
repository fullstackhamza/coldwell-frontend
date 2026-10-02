import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { ProductsTable } from "@/components/admin/ProductsTable";

export const metadata: Metadata = { title: "Admin — Products" };

export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <AdminNav />
      <ProductsTable />
    </AdminGuard>
  );
}
