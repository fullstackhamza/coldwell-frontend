"use client";

import type { ProductColor } from "@/lib/types";
import type { Filters } from "@/lib/filters";
import { priceBuckets } from "@/lib/filters";

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details open className="border-b border-line py-5 first:pt-0">
      <summary className="cursor-pointer list-none text-sm uppercase tracking-wide text-ink [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export function FilterPanel({
  facets,
  filters,
  onChange,
}: {
  facets: {
    subcategories: string[];
    colors: ProductColor[];
    sizes: string[];
  };
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  return (
    <div>
      <FilterSection title="Category">
        <div className="flex flex-col gap-2.5">
          {facets.subcategories.map((sub) => (
            <label
              key={sub}
              className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft"
            >
              <input
                type="checkbox"
                checked={filters.subcategories.includes(sub)}
                onChange={() =>
                  onChange({
                    ...filters,
                    subcategories: toggleValue(filters.subcategories, sub),
                  })
                }
                className="h-4 w-4 accent-ink"
              />
              {sub}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Size">
        <div className="flex flex-wrap gap-1.5">
          {facets.sizes.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() =>
                  onChange({ ...filters, sizes: toggleValue(filters.sizes, size) })
                }
                className={`min-w-[2.25rem] border px-2 py-1 text-xs transition ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink hover:border-ink"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {facets.colors.map((color) => {
            const active = filters.colors.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                title={color.name}
                onClick={() =>
                  onChange({
                    ...filters,
                    colors: toggleValue(filters.colors, color.name),
                  })
                }
                className={`h-6 w-6 rounded-full border transition ${
                  active
                    ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper"
                    : "border-line"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Price">
        <div className="flex flex-col gap-2.5">
          {priceBuckets.map((bucket) => (
            <label
              key={bucket.key}
              className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft"
            >
              <input
                type="checkbox"
                checked={filters.priceBuckets.includes(bucket.key)}
                onChange={() =>
                  onChange({
                    ...filters,
                    priceBuckets: toggleValue(filters.priceBuckets, bucket.key),
                  })
                }
                className="h-4 w-4 accent-ink"
              />
              {bucket.label}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Collection">
        <div className="flex flex-col gap-2.5">
          {["New Arrivals", "Best Sellers"].map((collection) => (
            <label
              key={collection}
              className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft"
            >
              <input
                type="checkbox"
                checked={filters.collections.includes(collection)}
                onChange={() =>
                  onChange({
                    ...filters,
                    collections: toggleValue(filters.collections, collection),
                  })
                }
                className="h-4 w-4 accent-ink"
              />
              {collection}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={() =>
              onChange({ ...filters, inStockOnly: !filters.inStockOnly })
            }
            className="h-4 w-4 accent-ink"
          />
          In Stock Only
        </label>
      </FilterSection>

      <FilterSection title="Discount">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={filters.onSaleOnly}
            onChange={() =>
              onChange({ ...filters, onSaleOnly: !filters.onSaleOnly })
            }
            className="h-4 w-4 accent-ink"
          />
          On Sale
        </label>
      </FilterSection>
    </div>
  );
}
