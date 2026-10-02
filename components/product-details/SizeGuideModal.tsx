"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const SIZE_CHART = [
  { size: "XS", chest: "34", waist: "27", hip: "35" },
  { size: "S", chest: "36", waist: "29", hip: "37" },
  { size: "M", chest: "39", waist: "32", hip: "40" },
  { size: "L", chest: "42", waist: "35", hip: "43" },
  { size: "XL", chest: "45", waist: "38", hip: "46" },
  { size: "XXL", chest: "48", waist: "41", hip: "49" },
];

export function SizeGuideModal({ onClose }: { onClose: () => void }) {
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
        className="relative w-full max-w-lg bg-paper p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">Size Guide</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="p-1">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          Measurements in inches. If you're between sizes, we recommend
          sizing up.
        </p>
        <table className="mt-5 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink-soft">
              <th className="py-2 font-normal">Size</th>
              <th className="py-2 font-normal">Chest</th>
              <th className="py-2 font-normal">Waist</th>
              <th className="py-2 font-normal">Hip</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART.map((row) => (
              <tr key={row.size} className="border-b border-line text-ink">
                <td className="py-2">{row.size}</td>
                <td className="py-2">{row.chest}&Prime;</td>
                <td className="py-2">{row.waist}&Prime;</td>
                <td className="py-2">{row.hip}&Prime;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
