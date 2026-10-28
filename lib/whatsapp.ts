import { WHATSAPP_NUMBER } from "@/lib/site-config";

/**
 * Turns the number from site-config into the form WhatsApp needs:
 * digits only, with the country code. "0300 1234567" becomes "923001234567".
 * Returns an empty string if no number is set.
 */
function normalisedNumber(): string {
  let digits = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = "92" + digits.slice(1);
  return digits;
}

/** A link that opens a WhatsApp chat with a message already typed in. */
export function whatsappUrl(message: string): string {
  const number = normalisedNumber();
  if (!number) return "";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
