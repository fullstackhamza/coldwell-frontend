"use client";

import Image from "next/image";
import { useState } from "react";

const PLACEHOLDER_TINTS = ["#EFEBE0", "#E4DCC8", "#DED2B8", "#D8CBB0"];

export function ProductGallery({
  productName,
  images,
}: {
  productName: string;
  images: string[];
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    // No photos uploaded yet for this product — same placeholder tiles as
    // before, so the page still looks intentional rather than broken.
    return (
      <div>
        <div
          className="aspect-[3/4] w-full transition-colors duration-300"
          style={{ backgroundColor: PLACEHOLDER_TINTS[active % PLACEHOLDER_TINTS.length] }}
          role="img"
          aria-label={`${productName} — photo placeholder`}
        />
        <div className="mt-3 grid grid-cols-4 gap-3">
          {PLACEHOLDER_TINTS.map((tint, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View photo ${index + 1}`}
              aria-current={active === index}
              className={`aspect-square transition ${
                active === index ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : ""
              }`}
              style={{ backgroundColor: tint }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand">
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${productName} — photo ${active + 1} of ${images.length}`}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View photo ${index + 1}`}
              aria-current={active === index}
              className={`relative aspect-square overflow-hidden bg-sand transition ${
                active === index ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : ""
              }`}
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
