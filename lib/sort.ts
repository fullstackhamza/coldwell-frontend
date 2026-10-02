import type { Product } from "./types";

export const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

export function sortProducts(list: Product[], sort: SortValue): Product[] {
  const copy = [...list];

  switch (sort) {
    case "newest":
      return copy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "best-selling":
      return copy.sort((a, b) => b.popularity - a.popularity);
    case "recommended":
    default:
      return copy;
  }
}
