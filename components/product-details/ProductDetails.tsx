"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";
import { ProductGallery } from "./ProductGallery";
import { SizeGuideModal } from "./SizeGuideModal";
import { ProductInfoAccordion } from "./ProductInfoAccordion";

export function ProductDetails({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name ?? "Default",
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [addedConfirmation, setAddedConfirmation] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const discount = discountPercent(product.price, product.compareAtPrice);
  const hasSizes = product.sizes.length > 0;
  const isSoldOut = Boolean(product.isThrift && product.sold);

  function validateSize(): boolean {
    if (hasSizes && !selectedSize) {
      setSizeError(true);
      return false;
    }
    return true;
  }

  function handleAddToCart() {
    if (!validateSize()) return;
    addItem({
      productSlug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      size: selectedSize ?? "One Size",
      color: selectedColor,
      quantity,
    });
    setAddedConfirmation(true);
  }

  function handleBuyNow() {
    if (!validateSize()) return;
    addItem({
      productSlug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      size: selectedSize ?? "One Size",
      color: selectedColor,
      quantity,
    });
    router.push("/checkout");
  }

  return (
    <div className="container-page py-10 md:py-14">
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <ProductGallery productName={product.name} images={product.images} />

        <div>
          <p className="text-xs uppercase tracking-wide text-ink-soft">
            {product.category} / {product.subcategory}
          </p>
          <h1 className="mt-1 font-display text-3xl text-ink md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
            <Star size={14} strokeWidth={1.5} className="fill-oxblood text-oxblood" />
            <span className="text-ink">{product.rating}</span>
            <span>({product.reviewCount} Reviews)</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-xl text-ink">{formatPrice(product.price)}</span>
            {isSoldOut && (
              <span className="rounded-sm bg-ink px-2 py-0.5 text-xs uppercase tracking-wide text-paper">
                Sold
              </span>
            )}
            {product.compareAtPrice && (
              <>
                <span className="text-sm text-ink-soft line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <span className="rounded-sm bg-oxblood px-2 py-0.5 text-xs text-paper">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className="mt-5 max-w-[52ch] text-sm text-ink-soft">
            {product.description}
          </p>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-wide text-ink-soft">
              Color: <span className="text-ink">{selectedColor}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  title={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`h-8 w-8 rounded-full border transition ${
                    selectedColor === color.name
                      ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper"
                      : "border-line"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          {hasSizes && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-ink-soft">
                  Size
                </p>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs uppercase tracking-wide text-ink underline underline-offset-4"
                >
                  Size Guide
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const unavailable = product.unavailableSizes?.includes(size);
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={unavailable}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={`min-w-[3rem] border px-3 py-2 text-sm transition ${
                        unavailable
                          ? "cursor-not-allowed border-line text-line line-through"
                          : active
                            ? "border-ink bg-ink text-paper"
                            : "border-line text-ink hover:border-ink"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {sizeError && (
                <p className="mt-2 text-xs text-oxblood">
                  Please select a size.
                </p>
              )}
            </div>
          )}

          <div className="mt-6">
            <p className="text-xs uppercase tracking-wide text-ink-soft">
              Quantity
            </p>
            <div className="mt-2 inline-flex items-center border border-line">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-ink transition hover:bg-sand"
              >
                −
              </button>
              <span className="w-10 text-center text-sm text-ink">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-ink transition hover:bg-sand"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {isSoldOut ? (
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed bg-line py-3.5 text-sm uppercase tracking-wide text-ink-soft"
              >
                Sold Out — One of a Kind
              </button>
            ) : addedConfirmation ? (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="border border-ink p-4"
              >
                <p className="text-sm text-ink">Added to your cart.</p>
                <div className="mt-3 flex gap-5">
                  <button
                    type="button"
                    onClick={() => setAddedConfirmation(false)}
                    className="border-b border-ink text-sm text-ink transition hover:border-oxblood hover:text-oxblood"
                  >
                    Continue Shopping
                  </button>
                  <Link
                    href="/cart"
                    className="border-b border-ink text-sm text-ink transition hover:border-oxblood hover:text-oxblood"
                  >
                    View Cart
                  </Link>
                </div>
              </motion.div>
            ) : (
              <>
                <motion.button
                  type="button"
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-ink py-3.5 text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood"
                >
                  Add to Cart
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleBuyNow}
                  whileTap={{ scale: 0.97 }}
                  className="w-full border border-ink py-3.5 text-sm uppercase tracking-wide text-ink transition hover:border-oxblood hover:text-oxblood"
                >
                  Buy Now
                </motion.button>
              </>
            )}

            <button
              type="button"
              onClick={() => setWishlisted((v) => !v)}
              className="flex items-center justify-center gap-2 py-2 text-sm text-ink-soft transition hover:text-ink"
            >
              <Heart
                size={16}
                strokeWidth={1.5}
                className={wishlisted ? "fill-oxblood text-oxblood" : "text-ink"}
              />
              {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          <div className="mt-8">
            <ProductInfoAccordion />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {sizeGuideOpen && (
          <SizeGuideModal onClose={() => setSizeGuideOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
