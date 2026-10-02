import type { Metadata } from "next";
import { OrderConfirmationContent } from "@/components/checkout/OrderConfirmationContent";

export const metadata: Metadata = { title: "Order Confirmed" };

type Props = { params: Promise<{ orderNumber: string }> };

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderNumber } = await params;
  return <OrderConfirmationContent orderNumber={orderNumber} />;
}
