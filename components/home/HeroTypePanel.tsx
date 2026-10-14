"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

type HeroTypePanelProps = {
  eyebrow?: string;
  lines?: string[];
  footer?: string;
  href?: string;
};

/**
 * Solid navy panel with large serif type. No images needed.
 * Change the text each season through the props below, or edit the defaults.
 */
export function HeroTypePanel({
  eyebrow = "Autumn and winter",
  lines = ["Cold", "weather", "ready"],
  footer = "Jackets, knits, layers",
  href = "/men",
}: HeroTypePanelProps) {
  const reduce = useReducedMotion();

  return (
    <Link
      href={href}
      className="group flex h-full min-h-[320px] flex-col justify-between p-6 md:min-h-[460px] md:p-8"
      style={{ background: "#2d3552", color: "#ffffff" }}
    >
      <motion.span
        className="text-sm"
        style={{ color: "#c9cde0" }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {eyebrow}
      </motion.span>

      {/* each line rises out from behind a mask, one after the other */}
      <h2 className="font-serif text-6xl italic leading-[0.95] md:text-8xl">
        {lines.map((line, i) => (
          <span key={line} className="block overflow-hidden pb-1">
            <motion.span
              className="block"
              initial={reduce ? false : { y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 + 0.15 * i, ease }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h2>

      <motion.div
        className="flex items-center justify-between pt-4 text-sm"
        style={{ borderTop: "1px solid rgba(255,255,255,0.3)" }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <span>{footer}</span>
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-300 group-hover:translate-x-2"
        >
          →
        </span>
      </motion.div>
    </Link>
  );
}
