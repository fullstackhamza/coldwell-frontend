"use client";

import { X } from "lucide-react";
import type { ProductColor } from "@/lib/types";
import { emptyFilters, type Filters, countActiveFilters } from "@/lib/filters";
import { sortOptions, type SortValue } from "@/lib/sort";
import { FilterPanel } from "./FilterPanel";

export function MobileFilterSheet({
  open,
  onClose,
  facets,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  facets: {
    subcategories: string[];
    colors: ProductColor[];
    sizes: string[];
  };
  filters: Filters;
  onFiltersChange: (next: Filters) => void;
  sort: SortValue;
  onSortChange: (value: SortValue) => void;
  resultCount: number;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-paper md:hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <span className="text-sm uppercase tracking-wide text-ink">
          Filter &amp; Sort
        </span>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="p-2 -mr-2"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <details open className="border-b border-line pb-5">
          <summary className="cursor-pointer list-none text-sm uppercase tracking-wide text-ink [&::-webkit-details-marker]:hidden">
            Sort By
          </summary>
          <div className="mt-4 flex flex-col gap-2.5">
            {sortOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft"
              >
                <input
                  type="radio"
                  name="mobile-sort"
                  checked={sort === option.value}
                  onChange={() => onSortChange(option.value)}
                  className="h-4 w-4 accent-ink"
                />
                {option.label}
              </label>
            ))}
          </div>
        </details>

        <div className="mt-5">
          <FilterPanel
            facets={facets}
            filters={filters}
            onChange={onFiltersChange}
          />
        </div>
      </div>

      <div className="flex gap-3 border-t border-line px-5 py-4">
        <button
          type="button"
          onClick={() => onFiltersChange(emptyFilters())}
          disabled={countActiveFilters(filters) === 0}
          className="flex-1 border border-ink py-3 text-sm uppercase tracking-wide text-ink transition disabled:opacity-40"
        >
          Clear All
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-ink py-3 text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood"
        >
          Show {resultCount} Results
        </button>
      </div>
    </div>
  );
}
