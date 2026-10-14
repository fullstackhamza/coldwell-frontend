export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Men" | "Women";
  subcategory: string;
  price: number;
  /** Present only when the item is on sale */
  compareAtPrice?: number;
  colors: ProductColor[];
  /** Absolute URLs. First image is the card/thumbnail; rest form the
   * product page gallery. Empty for products with no photos uploaded yet. */
  images: string[];
  sizes: string[];
  /** Sizes that exist for this product but are currently out of stock */
  unavailableSizes?: string[];
  description: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  /** One-of-a-kind secondhand item. */
  isThrift?: boolean;
  /** Only meaningful when isThrift is true — permanently true once bought. */
  sold?: boolean;
  /** ISO date — drives the "Newest" sort */
  createdAt: string;
  /** Relative popularity score — drives the "Best Selling" sort */
  popularity: number;
  rating: number;
  reviewCount: number;
};
