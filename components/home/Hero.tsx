"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

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

const ease = [0.22, 1, 0.36, 1] as const;

// Photos live in the "public/images" folder. All are 3:2, so the panel is 3:2 too.
const slides = [
  {
    src: "/images/hero-1.jpg",
    alt: "Six men in black and brown leather jackets on the steps of an old arched building",
  },
  {
    src: "/images/hero-2.jpg",
    alt: "Five men in leather jackets standing in a row on a tree-lined road",
  },
  {
    src: "/images/hero-3.jpg",
    alt: "Six men in leather jackets, one seated, in front of a white brick building",
  },
  {
    src: "/images/hero-4.jpg",
    alt: "Six men in black leather jackets laughing together on a tree-lined road",
  },
];

// Text on the photos. Change these each season.
const panel = {
  eyebrow: "Winter season",
  lines: ["Winter,", "sorted."],
  cta: "Shop winter wear",
  href: "/men",
};

const SLIDE_MS = 5500;

export function Hero() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const zoom = reduce ? 1 : 1.08;

  // auto-advance; stops on hover/focus and for visitors who prefer reduced motion
  useEffect(() => {
    if (reduce || paused) return;
    const t = setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_MS
    );
    return () => clearTimeout(t);
  }, [index, paused, reduce]);

  return (
    <section className="container-page grid grid-cols-1 items-center gap-10 py-10 md:grid-cols-2 md:py-16 lg:grid-cols-[1fr_1.5fr]">
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

      {/* Photo panel, 3:2 to match the photos, with text on top */}
      <motion.div
        className="relative order-1 aspect-[3/2] w-full overflow-hidden rounded-sm bg-ink md:order-2"
        initial={reduce ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* all photos stacked; the active one fades in and slowly settles */}
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <motion.div
              key={slide.src}
              className="absolute inset-0"
              initial={false}
              animate={
                active
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: zoom }
              }
              transition={
                active
                  ? {
                      opacity: { duration: 1.2 },
                      scale: { duration: 7, ease: "easeOut" },
                    }
                  : {
                      opacity: { duration: 1.2 },
                      scale: { duration: 0, delay: 1.2 },
                    }
              }
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                loading="eager"
                sizes="(min-width: 1024px) 60vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          );
        })}

        {/* dark fade at the bottom so the text stays readable */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-3/5"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.78), rgba(0,0,0,0.25) 60%, rgba(0,0,0,0))",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-paper md:p-7">
          <div>
            <motion.span
              className="block text-xs text-paper/90 md:text-sm"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {panel.eyebrow}
            </motion.span>

            {/* each line rises out from behind a mask, one after the other */}
            <h2 className="mt-1 font-display text-4xl italic leading-[0.95] lg:text-6xl">
              {panel.lines.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <motion.span
                    className="block"
                    initial={reduce ? false : { y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.55 + 0.15 * i,
                      ease,
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h2>

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <Link
                href={panel.href}
                className="group mt-3 inline-flex items-center gap-2 border-b border-paper/60 pb-0.5 text-sm transition hover:border-paper"
              >
                {panel.cta}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                >
                  →
                </span>
              </Link>
            </motion.div>
          </div>

          {/* photo indicators */}
          <div className="flex items-center gap-2 pb-1">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Show photo ${i + 1} of ${slides.length}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className="py-3"
              >
                <span
                  className={`block h-0.5 rounded-full bg-paper transition-all duration-500 ${
                    i === index ? "w-8 opacity-100" : "w-4 opacity-40"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
