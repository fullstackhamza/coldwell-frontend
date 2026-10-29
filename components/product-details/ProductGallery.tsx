"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PLACEHOLDER_TINTS = ["#EFEBE0", "#E4DCC8", "#DED2B8", "#D8CBB0"];

// How far (in pixels) a finger has to move to count as a swipe.
const SWIPE_DISTANCE = 50;
const SWIPE_SPEED = 400;

export function ProductGallery({
  productName,
  images,
}: {
  productName: string;
  images: string[];
}) {
  const [active, setActive] = useState(0);
  // 1 = moving forward (next photo), -1 = moving back. Used for the slide-in.
  const [direction, setDirection] = useState(1);

  if (images.length === 0) {
    // No photos uploaded yet for this product — same placeholder tiles as
    // before, so the page still looks intentional rather than broken.
    return (
      <div>
        <div
          className="aspect-[3/4] w-full transition-colors duration-300"
          style={{ backgroundColor: PLACEHOLDER_TINTS[active % PLACEHOLDER_TINTS.length] }}
          role="img"
          aria-label={productName + " — photo placeholder"}
        />
        <div className="mt-3 grid grid-cols-4 gap-3">
          {PLACEHOLDER_TINTS.map((tint, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={"View photo " + (index + 1)}
              aria-current={active === index}
              className={
                "aspect-square transition " +
                (active === index ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : "")
              }
              style={{ backgroundColor: tint }}
            />
          ))}
        </div>
      </div>
    );
  }

  const count = images.length;

  function goTo(index: number) {
    if (index === active) return;
    setDirection(index > active ? 1 : -1);
    setActive(index);
  }
  function next() {
    if (active < count - 1) goTo(active + 1);
  }
  function prev() {
    if (active > 0) goTo(active - 1);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_SPEED) next();
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_SPEED) prev();
  }

  return (
    <div>
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-sand"
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={productName + " photos"}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") next();
          if (e.key === "ArrowLeft") prev();
        }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={images[active]}
            custom={direction}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            variants={{
              enter: (d: number) => ({ x: d * 60, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -60, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={handleDragEnd}
            style={{ touchAction: "pan-y" }}
          >
            <Image
              src={images[active]}
              alt={productName + " — photo " + (active + 1) + " of " + count}
              fill
              priority
              draggable={false}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="select-none object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            {/* Arrows: handy with a mouse; hidden on phones where you swipe */}
            <button
              type="button"
              aria-label="Previous photo"
              onClick={prev}
              disabled={active === 0}
              className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center bg-paper/85 text-ink transition hover:bg-paper disabled:opacity-30 md:flex"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={next}
              disabled={active === count - 1}
              className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center bg-paper/85 text-ink transition hover:bg-paper disabled:opacity-30 md:flex"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>

            {/* Dots show where you are while swiping */}
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {images.map((url, index) => (
                <span
                  key={url}
                  className={
                    "h-1.5 rounded-full transition-all " +
                    (index === active ? "w-5 bg-paper" : "w-1.5 bg-paper/60")
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => goTo(index)}
              aria-label={"View photo " + (index + 1)}
              aria-current={active === index}
              className={
                "relative aspect-square overflow-hidden bg-sand transition " +
                (active === index ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : "")
              }
            >
              <Image
                src={url}
                alt=""
                aria-hidden
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
