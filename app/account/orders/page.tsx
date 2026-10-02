import type { Metadata } from "next";
import { OrderHistoryContent } from "@/components/account/OrderHistoryContent";

export const metadata: Metadata = { title: "My Orders" };

export default function OrderHistoryPage() {
  return <OrderHistoryContent />;
}
