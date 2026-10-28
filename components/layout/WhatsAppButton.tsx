"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";

export function WhatsAppButton() {
  const pathname = usePathname();
  const url = whatsappUrl("Hi Coldwell, I have a question about your products.");

  // Hidden until a number is set in site-config, and never shown in the admin.
  if (!url || pathname.startsWith("/admin")) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
    >
      <MessageCircle size={26} strokeWidth={1.75} />
    </a>
  );
}
