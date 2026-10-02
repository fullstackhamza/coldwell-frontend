"use client";

import { ChevronDown } from "lucide-react";
import { sortOptions, type SortValue } from "@/lib/sort";

export function SortSelect({
  value,
  onChange,
}: {
  value: SortValue;
  onChange: (value: SortValue) => void;
}) {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortValue)}
        aria-label="Sort products"
        className="appearance-none border border-line bg-paper py-2 pl-3 pr-8 text-sm text-ink focus:border-ink focus:outline-none"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            Sort: {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        strokeWidth={1.5}
        className="pointer-events-none absolute right-2.5 text-ink-soft"
      />
    </div>
  );
}
