"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  createProduct,
  updateProduct,
  uploadProductImage,
  type ProductInput,
} from "@/lib/api/products";
import { ApiError } from "@/lib/api-client";
import type { Product, ProductColor } from "@/lib/types";

const inputClass =
  "border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none";

function parseSizes(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProductForm({
  initialProduct,
}: {
  initialProduct?: Product;
}) {
  const isEditing = !!initialProduct;
  const router = useRouter();
  const { token } = useAuth();

  const [slug, setSlug] = useState(initialProduct?.slug ?? "");
  const [name, setName] = useState(initialProduct?.name ?? "");
  const [category, setCategory] = useState<"Men" | "Women">(
    initialProduct?.category ?? "Men",
  );
  const [subcategory, setSubcategory] = useState(
    initialProduct?.subcategory ?? "",
  );
  const [price, setPrice] = useState(String(initialProduct?.price ?? ""));
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialProduct?.compareAtPrice ? String(initialProduct.compareAtPrice) : "",
  );
  const [description, setDescription] = useState(
    initialProduct?.description ?? "",
  );
  const [sizesInput, setSizesInput] = useState(
    initialProduct?.sizes?.join(", ") ?? "",
  );
  const [unavailableSizes, setUnavailableSizes] = useState<string[]>(
    initialProduct?.unavailableSizes ?? [],
  );
  const [colors, setColors] = useState<ProductColor[]>(
    initialProduct?.colors ?? [{ name: "", hex: "#000000" }],
  );
  const [isNewArrival, setIsNewArrival] = useState(
    initialProduct?.isNewArrival ?? false,
  );
  const [isBestSeller, setIsBestSeller] = useState(
    initialProduct?.isBestSeller ?? false,
  );
  const [isThrift, setIsThrift] = useState(initialProduct?.isThrift ?? false);
  const [sold, setSold] = useState(initialProduct?.sold ?? false);
  const [images, setImages] = useState<string[]>(
    initialProduct?.images ?? [],
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    // Snapshot into a real array BEFORE clearing the input below — in
    // Chrome, resetting e.target.value also empties out the live
    // FileList in place, so grabbing files after the reset (or reusing
    // this same reference post-reset) silently loses every selected file
    // with no error at all. Snapshotting first avoids that.
    const selectedFiles = Array.from(fileList);
    e.target.value = ""; // allow picking the same file again later

    if (!token) {
      setUploadError("You must be logged in as an admin.");
      return;
    }

    setUploadError(null);
    setUploading(true);
    try {
      // Sequential, not Promise.all — keeps the upload order predictable
      // (first picked = first in the gallery) and avoids hammering the
      // server with a burst of simultaneous multipart uploads.
      for (const file of selectedFiles) {
        const url = await uploadProductImage(file, token);
        setImages((prev) => [...prev, url]);
      }
    } catch (err) {
      setUploadError(
        err instanceof ApiError ? err.message : "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  const sizes = parseSizes(sizesInput);

  function toggleUnavailable(size: string) {
    setUnavailableSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  }

  function updateColor(index: number, field: keyof ProductColor, value: string) {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    );
  }

  function addColorRow() {
    setColors((prev) => [...prev, { name: "", hex: "#000000" }]);
  }

  function removeColorRow(index: number) {
    setColors((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("You must be logged in as an admin.");
      return;
    }

    const payload: Omit<ProductInput, "slug"> = {
      name,
      category,
      subcategory,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      colors: colors.filter((c) => c.name.trim()),
      sizes,
      unavailableSizes: unavailableSizes.filter((s) => sizes.includes(s)),
      images,
      description,
      isNewArrival,
      isBestSeller,
      isThrift,
      sold,
    };

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateProduct(slug, payload, token);
      } else {
        await createProduct({ slug, ...payload }, token);
      }
      router.push("/admin/products");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl text-ink">
        {isEditing ? `Edit ${initialProduct!.name}` : "Add Product"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-2xl flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wide text-ink-soft">
            Slug {isEditing && "(can't be changed)"}
          </span>
          <input
            required
            disabled={isEditing}
            className={`${inputClass} disabled:opacity-60`}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. classic-black-tshirt"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wide text-ink-soft">
            Name
          </span>
          <input
            required
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wide text-ink-soft">
              Category
            </span>
            <select
              className={inputClass}
              value={category}
              onChange={(e) => setCategory(e.target.value as "Men" | "Women")}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wide text-ink-soft">
              Subcategory
            </span>
            <input
              required
              className={inputClass}
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              placeholder="e.g. T-Shirts"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wide text-ink-soft">
              Price (PKR)
            </span>
            <input
              required
              type="number"
              min="0"
              className={inputClass}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wide text-ink-soft">
              Sale Price (optional)
            </span>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="Leave blank if not on sale"
            />
          </label>
        </div>
        {compareAtPrice && Number(compareAtPrice) <= Number(price || 0) && (
          <p className="-mt-3 text-xs text-oxblood">
            Sale price should usually be higher than the current price — it's
            shown crossed out as the "original" price.
          </p>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wide text-ink-soft">
            Description
          </span>
          <textarea
            required
            rows={3}
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div>
          <span className="text-xs uppercase tracking-wide text-ink-soft">
            Photos
          </span>
          <p className="mt-1 text-xs text-ink-soft">
            First photo is used as the card thumbnail. Drag order isn't
            supported yet — remove and re-add to reorder.
          </p>

          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {images.map((url, index) => (
                <div key={url} className="relative h-24 w-24">
                  {/* eslint-disable-next-line @next/next/no-img-element --
                      uploaded photos come from arbitrary URLs (local
                      uploads or seeded Unsplash/Cloudinary links), so
                      next/image's remotePatterns allowlist can't cover
                      them all in the admin preview. */}
                  <img
                    src={url}
                    alt={`Product photo ${index + 1}`}
                    className="h-full w-full border border-line object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-ink/80 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-paper">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label="Remove photo"
                    className="absolute -right-2 -top-2 rounded-full bg-ink p-1 text-paper transition hover:bg-oxblood"
                  >
                    <X size={12} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 border border-line px-4 py-2.5 text-sm text-ink transition hover:border-ink">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              disabled={uploading}
              onChange={handleImagePick}
              className="hidden"
            />
            {uploading ? "Uploading…" : "Add Photos"}
          </label>
          {uploadError && (
            <p className="mt-1.5 text-xs text-oxblood">{uploadError}</p>
          )}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wide text-ink-soft">
            Sizes (comma-separated)
          </span>
          <input
            className={inputClass}
            value={sizesInput}
            onChange={(e) => setSizesInput(e.target.value)}
            placeholder="XS, S, M, L, XL"
          />
        </label>

        {sizes.length > 0 && (
          <div>
            <span className="text-xs uppercase tracking-wide text-ink-soft">
              Mark sizes out of stock
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((size) => {
                const out = unavailableSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleUnavailable(size)}
                    className={`min-w-[3rem] border px-3 py-1.5 text-sm transition ${
                      out
                        ? "border-oxblood text-oxblood line-through"
                        : "border-line text-ink"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <span className="text-xs uppercase tracking-wide text-ink-soft">
            Colors
          </span>
          <div className="mt-2 flex flex-col gap-2">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  className={`${inputClass} flex-1`}
                  value={color.name}
                  onChange={(e) => updateColor(index, "name", e.target.value)}
                  placeholder="Color name, e.g. Black"
                />
                <input
                  type="color"
                  className="h-10 w-14 border border-line bg-paper"
                  value={color.hex}
                  onChange={(e) => updateColor(index, "hex", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeColorRow(index)}
                  className="px-2 text-sm text-ink-soft transition hover:text-oxblood"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addColorRow}
              className="mt-1 self-start border-b border-ink text-sm text-ink transition hover:border-oxblood hover:text-oxblood"
            >
              Add Color
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
              className="h-4 w-4 accent-ink"
            />
            New Arrival
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
              className="h-4 w-4 accent-ink"
            />
            Best Seller
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={isThrift}
              onChange={(e) => setIsThrift(e.target.checked)}
              className="h-4 w-4 accent-ink"
            />
            Thrift item (one of a kind)
          </label>
        </div>

        {isThrift && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={sold}
              onChange={(e) => setSold(e.target.checked)}
              className="h-4 w-4 accent-ink"
            />
            Mark as sold
            <span className="text-xs text-ink-soft">
              (this happens automatically when it's ordered — only check
              this by hand if you sold it outside the site)
            </span>
          </label>
        )}

        {error && <p className="text-sm text-oxblood">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full bg-ink py-3.5 text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood disabled:opacity-60 sm:w-auto sm:px-10"
        >
          {submitting
            ? "Saving…"
            : isEditing
              ? "Save Changes"
              : "Create Product"}
        </button>
      </form>
    </div>
  );
}
