import type { Metadata } from "next";
import { OrderTrackingContent } from "@/components/account/OrderTrackingContent";

export const metadata: Metadata = { title: "Track Order" };

export default function TrackOrderPage() {
  return <OrderTrackingContent />;
}
