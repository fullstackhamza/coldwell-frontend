import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const metadata: Metadata = { title: "Admin — Orders" };

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <AdminNav />
      <OrdersTable />
    </AdminGuard>
  );
}
