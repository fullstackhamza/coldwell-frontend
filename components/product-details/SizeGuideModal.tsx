"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type Guide = {
  title: string;
  intro: string;
  columns: { key: string; label: string }[];
  rows: Record<string, string>[];
  details?: { label: string; value: string }[];
  fitPoints?: string[];
  note?: string;
};

// ---------------------------------------------------------------------------
// The standard chart, used for every product that has no guide of its own.
// To change the numbers, edit the values inside the quotes.
// ---------------------------------------------------------------------------
const STANDARD_GUIDE: Guide = {
  title: "Size Guide",
  intro: "Measurements in inches. If you're between sizes, we recommend sizing up.",
  columns: [
    { key: "size", label: "Size" },
    { key: "chest", label: "Chest" },
    { key: "waist", label: "Waist" },
    { key: "hip", label: "Hip" },
  ],
  rows: [
    { size: "XS", chest: "34", waist: "27", hip: "35" },
    { size: "S", chest: "36", waist: "29", hip: "37" },
    { size: "M", chest: "39", waist: "32", hip: "40" },
    { size: "L", chest: "42", waist: "35", hip: "43" },
    { size: "XL", chest: "45", waist: "38", hip: "46" },
    { size: "XXL", chest: "48", waist: "41", hip: "49" },
  ],
};

// ---------------------------------------------------------------------------
// The hoodie guide. Shown for every product whose type is Hoodies.
// ---------------------------------------------------------------------------
const HOODIE_GUIDE: Guide = {
  title: "Hoodie Size & Fit Guide",
  intro:
    "All measurements are in inches (garment measurements). Chest (½) is half of the full chest width, measured flat across the front.",
  columns: [
    { key: "size", label: "Size" },
    { key: "chest", label: "Chest (½)" },
    { key: "length", label: "Body Length" },
    { key: "shoulder", label: "Shoulder" },
    { key: "sleeve", label: "Sleeve" },
  ],
  rows: [
    { size: "S", chest: "22", length: "25.5", shoulder: "22.5", sleeve: "22.5" },
    { size: "M", chest: "23", length: "26.5", shoulder: "23.5", sleeve: "23" },
    { size: "L", chest: "24", length: "27.5", shoulder: "24.5", sleeve: "23.5" },
  ],
  details: [
    { label: "Fit", value: "Boxy / Oversized" },
    { label: "Fabric", value: "320 – 350 GSM" },
    { label: "Style", value: "Pullover  " },
    { label: "Gender", value: "Unisex" },
  ],
 
  note: "Measurements may vary by ±0.5 inch.",
};

function guideFor(subcategory?: string): Guide {
  if (subcategory && /hood/i.test(subcategory)) return HOODIE_GUIDE;
  return STANDARD_GUIDE;
}

export function SizeGuideModal({
  onClose,
  subcategory,
}: {
  onClose: () => void;
  subcategory?: string;
}) {
  const guide = guideFor(subcategory);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.button
        aria-label="Close size guide"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-ink/40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto bg-paper p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">{guide.title}</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="p-1">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <p className="mt-2 text-sm text-ink-soft">{guide.intro}</p>

        <table className="mt-5 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink-soft">
              {guide.columns.map((col) => (
                <th key={col.key} className="py-2 pr-2 font-normal">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guide.rows.map((row) => (
              <tr key={row.size} className="border-b border-line text-ink">
                {guide.columns.map((col) => (
                  <td key={col.key} className="py-2 pr-2">
                    {row[col.key]}
                    {col.key === "size" ? "" : "\u2033"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {guide.note && (
          <p className="mt-3 text-xs text-ink-soft">{guide.note}</p>
        )}

        {guide.details && (
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            {guide.details.map((item) => (
              <div key={item.label} className="contents">
                <dt className="text-ink-soft">{item.label}</dt>
                <dd className="text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {guide.fitPoints && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-wide text-ink-soft">
              Fit details
            </p>
            <ul className="mt-2 grid gap-x-6 gap-y-1.5 text-sm text-ink sm:grid-cols-2">
              {guide.fitPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
}
