"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterPanel } from "./FilterPanel";
import { SortSelect } from "./SortSelect";
import { MobileFilterSheet } from "./MobileFilterSheet";
import {
  emptyFilters,
  deriveFacets,
  applyFilters,
  countActiveFilters,
  type Filters,
} from "@/lib/filters";
import { sortProducts, type SortValue } from "@/lib/sort";

export function ShopListing({
  title,
  eyebrow,
  baseProducts,
}: {
  title: string;
  eyebrow?: string;
  baseProducts: Product[];
}) {
  const [filters, setFilters] = useState<Filters>(emptyFilters());
  const [sort, setSort] = useState<SortValue>("recommended");
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const facets = useMemo(() => deriveFacets(baseProducts), [baseProducts]);
  const filtered = useMemo(
    () => applyFilters(baseProducts, filters),
    [baseProducts, filters],
  );
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort]);
  const activeCount = countActiveFilters(filters);

  return (
    <div className="container-page py-10 md:py-14">
      <div className="mb-8 flex flex-col gap-1">
        {eyebrow && (
          <p className="text-sm uppercase tracking-wide text-oxblood">
            {eyebrow}
          </p>
        )}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-ink md:text-5xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              {sorted.length} {sorted.length === 1 ? "Product" : "Products"}
            </p>
          </div>
          <div className="hidden md:block">
            <SortSelect value={sort} onChange={setSort} />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setMobileSheetOpen(true)}
        className="mb-6 flex w-full items-center justify-center gap-2 border border-ink py-3 text-sm uppercase tracking-wide text-ink md:hidden"
      >
        <SlidersHorizontal size={16} strokeWidth={1.5} />
        Filter &amp; Sort
        {activeCount > 0 && (
          <span className="rounded-full bg-ink px-1.5 py-0.5 text-xs text-paper">
            {activeCount}
          </span>
        )}
      </button>

      <div className="flex gap-10">
        <aside className="hidden w-56 shrink-0 md:block">
          <FilterPanel
            facets={facets}
            filters={filters}
            onChange={setFilters}
          />
        </aside>

        <div className="flex-1">
          {sorted.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-ink">No products match those filters.</p>
              <button
                type="button"
                onClick={() => setFilters(emptyFilters())}
                className="mt-4 border-b border-ink text-sm text-ink transition hover:border-oxblood hover:text-oxblood"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
              {sorted.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <MobileFilterSheet
        open={mobileSheetOpen}
        onClose={() => setMobileSheetOpen(false)}
        facets={facets}
        filters={filters}
        onFiltersChange={setFilters}
        sort={sort}
        onSortChange={setSort}
        resultCount={sorted.length}
      />
    </div>
  );
}
