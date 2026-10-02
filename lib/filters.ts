import type { Product, ProductColor } from "./types";

export const priceBuckets = [
  { key: "under-2000", label: "Under PKR 2,000", min: 0, max: 2000 },
  { key: "2000-4000", label: "PKR 2,000 – 4,000", min: 2000, max: 4000 },
  { key: "4000-6000", label: "PKR 4,000 – 6,000", min: 4000, max: 6000 },
  { key: "6000-plus", label: "PKR 6,000+", min: 6000, max: Infinity },
] as const;

export type Filters = {
  subcategories: string[];
  colors: string[];
  sizes: string[];
  priceBuckets: string[];
  collections: string[]; // "New Arrivals" | "Best Sellers"
  onSaleOnly: boolean;
  inStockOnly: boolean;
};

export function emptyFilters(): Filters {
  return {
    subcategories: [],
    colors: [],
    sizes: [],
    priceBuckets: [],
    collections: [],
    onSaleOnly: false,
    inStockOnly: false,
  };
}

export function countActiveFilters(filters: Filters): number {
  return (
    filters.subcategories.length +
    filters.colors.length +
    filters.sizes.length +
    filters.priceBuckets.length +
    filters.collections.length +
    (filters.onSaleOnly ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0)
  );
}

export function deriveFacets(products: Product[]) {
  const subcategories = Array.from(
    new Set(products.map((p) => p.subcategory)),
  ).sort();

  const colorMap = new Map<string, ProductColor>();
  products.forEach((p) =>
    p.colors.forEach((c) => colorMap.set(c.name, c)),
  );
  const colors = Array.from(colorMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const sizes = Array.from(new Set(products.flatMap((p) => p.sizes))).sort(
    (a, b) => a.localeCompare(b, undefined, { numeric: true }),
  );

  return { subcategories, colors, sizes };
}

function productInStock(product: Product): boolean {
  const unavailable = product.unavailableSizes ?? [];
  return product.sizes.some((size) => !unavailable.includes(size));
}

export function applyFilters(products: Product[], filters: Filters): Product[] {
  return products.filter((product) => {
    if (
      filters.subcategories.length &&
      !filters.subcategories.includes(product.subcategory)
    ) {
      return false;
    }

    if (
      filters.colors.length &&
      !product.colors.some((c) => filters.colors.includes(c.name))
    ) {
      return false;
    }

    if (
      filters.sizes.length &&
      !product.sizes.some((s) => filters.sizes.includes(s))
    ) {
      return false;
    }

    if (filters.priceBuckets.length) {
      const inRange = priceBuckets.some(
        (bucket) =>
          filters.priceBuckets.includes(bucket.key) &&
          product.price >= bucket.min &&
          product.price < bucket.max,
      );
      if (!inRange) return false;
    }

    if (filters.collections.length) {
      const matches =
        (filters.collections.includes("New Arrivals") &&
          product.isNewArrival) ||
        (filters.collections.includes("Best Sellers") &&
          product.isBestSeller);
      if (!matches) return false;
    }

    if (filters.onSaleOnly && !product.compareAtPrice) return false;
    if (filters.inStockOnly && !productInStock(product)) return false;

    return true;
  });
}
