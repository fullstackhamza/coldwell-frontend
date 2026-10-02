"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export function Hero() {
  return (
    <section className="container-page grid grid-cols-1 items-center gap-10 py-10 md:grid-cols-2 md:py-16">
      <motion.div
        className="order-2 md:order-1"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={item}
          className="text-sm uppercase tracking-wide text-oxblood"
        >
          New Season
        </motion.p>
        <motion.h1
          variants={item}
          className="mt-3 font-display text-5xl leading-[1.05] text-ink md:text-6xl"
        >
          Discover
          <br />
          your style
        </motion.h1>
        <motion.p variants={item} className="mt-5 max-w-[38ch] text-ink-soft">
          Considered basics and standout pieces, built for how Pakistan
          actually gets dressed — day to day, season to season.
        </motion.p>
        <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/men"
            className="rounded-sm bg-ink px-7 py-3 text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood"
          >
            Shop Men
          </Link>
          <Link
            href="/women"
            className="rounded-sm border border-ink px-7 py-3 text-sm uppercase tracking-wide text-ink transition hover:border-oxblood hover:text-oxblood"
          >
            Shop Women
          </Link>
        </motion.div>
      </motion.div>

      {/* Placeholder for hero photography — swap for a real image later */}
      <motion.div
        className="order-1 aspect-[4/5] w-full rounded-sm bg-sand md:order-2"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      />
    </section>
  );
}
