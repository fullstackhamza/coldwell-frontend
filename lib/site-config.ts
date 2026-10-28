// Central place for brand-level constants.
// Replace SITE_NAME with the real brand name whenever it's ready —
// nothing else in the codebase needs to change.

export const SITE_NAME = "COLDWELL";
export const SITE_TAGLINE = "Modern everyday fashion";

// Your public website address. Used in the links people send you on WhatsApp.
export const SITE_URL = "https://coldwell.store";

// The WhatsApp number customers message. Type it the normal way, for example
// "0300 1234567" or "+92 300 1234567". Leave it empty to hide all WhatsApp
// buttons.
export const WHATSAPP_NUMBER = "03107977635";

export const INSTAGRAM_HANDLE = "coldwell.studio";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;

export const CURRENCY = "PKR";
export const STANDARD_DELIVERY_FEE = 200;
export const FREE_DELIVERY_THRESHOLD = 5000;

export const PAKISTAN_PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Jammu & Kashmir",
  "Gilgit-Baltistan",
] as const;