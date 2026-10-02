"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { NavCategory } from "@/lib/navigation";

export function MegaMenu({ category }: { category: NavCategory }) {
  if (!category.subcategories?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute left-0 top-full w-full border-t border-line bg-paper shadow-[0_12px_24px_-16px_rgba(21,20,15,0.25)]"
      role="region"
      aria-label={`${category.label} categories`}
    >
      <div className="container-page grid grid-cols-4 gap-8 py-8">
        <div className="col-span-1">
          <p className="font-display text-2xl italic text-ink">{category.label}</p>
          <p className="mt-2 max-w-[22ch] text-sm text-ink-soft">
            Shop the full {category.label.toLowerCase()} edit, from everyday
            basics to standout pieces.
          </p>
          {category.viewAllHref && (
            <Link
              href={category.viewAllHref}
              className="mt-4 inline-block border-b border-ink text-sm font-medium text-ink transition hover:border-oxblood hover:text-oxblood"
            >
              View all {category.label}
            </Link>
          )}
        </div>

        <div className="col-span-3 grid grid-cols-3 gap-x-6 gap-y-3">
          {category.subcategories.map((sub) => (
            <Link
              key={sub.href}
              href={sub.href}
              className="py-1 text-sm text-ink-soft transition hover:text-ink"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
