"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { mainNav, footerNav } from "@/lib/navigation";

export function MobileMenu({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-[60] flex md:hidden">
      <motion.button
        aria-label="Close menu"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-ink/40"
      />
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-paper"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="font-display text-lg tracking-wide">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="p-2 -mr-2"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 px-5 py-4" aria-label="Mobile">
          {mainNav.map((item) => {
            const hasChildren = !!item.subcategories?.length;
            const isOpen = expanded === item.label;
            return (
              <div key={item.href} className="border-b border-line py-3">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`text-base ${
                      item.label === "Sale" ? "text-oxblood" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {hasChildren && (
                    <button
                      type="button"
                      aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : item.label)}
                      className="p-2"
                    >
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="block"
                      >
                        <ChevronDown size={18} strokeWidth={1.5} />
                      </motion.span>
                    </button>
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {hasChildren && isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 pl-1">
                        {item.subcategories!.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={onClose}
                            className="py-1 text-sm text-ink-soft"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-line px-5 py-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-ink-soft">
            Help
          </p>
          <div className="flex flex-col gap-2">
            {footerNav.help.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="text-sm text-ink-soft"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
