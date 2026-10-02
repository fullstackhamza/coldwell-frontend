"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);
  const { addItem } = useCart();

  const discount = discountPercent(product.price, product.compareAtPrice);
  const isSoldOut = Boolean(product.isThrift && product.sold);
  const productHref = `/product/${product.slug}`;
  const staggerDelay = Math.min((index % 4) * 0.08, 0.32);

  function handleSelectSize(size: string) {
    // Quick Add always uses the product's first color — pick a specific
    // color on the product page itself.
    addItem({
      productSlug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      size,
      color: product.colors[0]?.name ?? "Default",
    });
    setAddedSize(size);
    setTimeout(() => {
      setAddedSize(null);
      setQuickAddOpen(false);
    }, 1200);
  }

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: staggerDelay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand">
        <Link
          href={productHref}
          className={`absolute inset-0 ${isSoldOut ? "grayscale" : ""}`}
          aria-label={product.name}
        >
          {product.images.length > 0 ? (
            <>
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className={`object-cover transition-opacity duration-300 ${isSoldOut ? "" : "group-hover:opacity-0"}`}
              />
              {/* Second photo as the hover "back" shot when there is one;
                  otherwise just fade the same photo back in. Skipped for
                  sold items — no point animating something you can't buy. */}
              {!isSoldOut && (
                <Image
                  src={product.images[1] ?? product.images[0]}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            // No photos uploaded yet for this product — placeholder blocks.
            <>
              <div className="absolute inset-0 bg-sand transition-opacity duration-300 group-hover:opacity-0" />
              <div className="absolute inset-0 bg-[#E4DCC8] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </>
          )}
        </Link>

        <motion.button
          type="button"
          onClick={() => setWishlisted((v) => !v)}
          aria-label={
            wishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={wishlisted}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
          className="absolute right-3 top-3 z-10 rounded-full bg-paper/80 p-2 backdrop-blur-sm transition-colors hover:bg-paper"
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={wishlisted ? "fill-oxblood text-oxblood" : "text-ink"}
          />
        </motion.button>

        {isSoldOut ? (
          <span className="absolute left-3 top-3 z-10 rounded-sm bg-ink px-2 py-1 text-xs uppercase tracking-wide text-paper">
            Sold
          </span>
        ) : (
          discount && (
            <span className="absolute left-3 top-3 z-10 rounded-sm bg-oxblood px-2 py-1 text-xs text-paper">
              -{discount}%
            </span>
          )
        )}

        {/* Quick Add — desktop hover affordance */}
        {!isSoldOut && (
          <div className="absolute inset-x-0 bottom-0 z-10 hidden translate-y-full bg-paper transition-transform duration-200 group-hover:translate-y-0 md:block">
            {!quickAddOpen ? (
              <button
                type="button"
                onClick={() => setQuickAddOpen(true)}
                className="w-full py-3 text-center text-xs uppercase tracking-wide text-ink transition hover:text-oxblood"
              >
                Quick Add
              </button>
            ) : (
              <div className="p-3">
                {addedSize ? (
                  <p className="py-1.5 text-center text-xs uppercase tracking-wide text-oxblood">
                    Added — {addedSize}
                  </p>
                ) : (
                  <>
                    <p className="mb-2 text-center text-xs uppercase tracking-wide text-ink-soft">
                      Select size
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {product.sizes.map((size) => {
                        const unavailable =
                          product.unavailableSizes?.includes(size);
                        return (
                          <button
                            key={size}
                            type="button"
                            disabled={unavailable}
                            onClick={() => handleSelectSize(size)}
                            className={`min-w-[2.25rem] border px-2 py-1 text-xs transition ${
                              unavailable
                                ? "cursor-not-allowed border-line text-line line-through"
                                : "border-ink text-ink hover:bg-ink hover:text-paper"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-xs uppercase tracking-wide text-ink-soft">
          {product.subcategory}
        </p>
        <Link href={productHref}>
          <h3 className="mt-1 text-sm text-ink">{product.name}</h3>
        </Link>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm text-ink">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-soft line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <div className="mt-2 flex gap-1.5">
          {product.colors.map((color) => (
            <span
              key={color.name}
              title={color.name}
              className="h-3.5 w-3.5 rounded-full border border-line"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
