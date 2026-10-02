import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { DashboardContent } from "@/components/admin/DashboardContent";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminNav />
      <DashboardContent />
    </AdminGuard>
  );
}
