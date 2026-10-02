import type { Product, ProductColor } from "@/lib/types";
import { apiFetch, ApiError, API_URL } from "@/lib/api-client";

export type ProductQuery = {
  category?: "Men" | "Women";
  subcategory?: string[];
  colors?: string[];
  sizes?: string[];
  priceMin?: number;
  priceMax?: number;
  collection?: string[];
  onSale?: boolean;
  inStock?: boolean;
  sort?: string;
  /** Free-text search over name/description/subcategory. */
  search?: string;
  page?: number;
  limit?: number;
};

function buildQueryString(query: ProductQuery): string {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  query.subcategory?.forEach((s) => params.append("subcategory", s));
  query.colors?.forEach((c) => params.append("colors", c));
  query.sizes?.forEach((s) => params.append("sizes", s));
  if (query.priceMin != null) params.set("price_min", String(query.priceMin));
  if (query.priceMax != null) params.set("price_max", String(query.priceMax));
  query.collection?.forEach((c) => params.append("collection", c));
  if (query.onSale) params.set("on_sale", "true");
  if (query.inStock) params.set("in_stock", "true");
  if (query.sort) params.set("sort", query.sort);
  if (query.search) params.set("q", query.search);
  if (query.page != null) params.set("page", String(query.page));
  if (query.limit != null) params.set("limit", String(query.limit));
  return params.toString();
}

export async function fetchProducts(query: ProductQuery = {}): Promise<Product[]> {
  const qs = buildQueryString(query);
  return apiFetch<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
}

/** Same as fetchProducts, but also returns the total match count (from the
 * X-Total-Count header) — use this when driving pagination UI. */
export async function fetchProductsPaged(
  query: ProductQuery = {},
): Promise<{ items: Product[]; total: number }> {
  const qs = buildQueryString(query);
  const res = await fetch(`${API_URL}/api/products${qs ? `?${qs}` : ""}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.detail ?? res.statusText);
  }
  const items: Product[] = await res.json();
  const total = Number(res.headers.get("X-Total-Count") ?? items.length);
  return { items, total };
}

/** Uploads a single image and returns its URL. Admin only — pass the
 * admin's Bearer token. */
export async function uploadProductImage(
  file: File,
  token: string,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/api/uploads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.detail ?? res.statusText);
  }
  const data = await res.json();
  return data.url as string;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/api/products/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export type ProductInput = {
  slug: string;
  name: string;
  category: "Men" | "Women";
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  colors: ProductColor[];
  sizes: string[];
  unavailableSizes: string[];
  images: string[];
  description: string;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isThrift: boolean;
  sold: boolean;
};

export async function createProduct(
  input: ProductInput,
  token: string,
): Promise<Product> {
  return apiFetch<Product>("/api/products", {
    method: "POST",
    body: JSON.stringify(input),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateProduct(
  slug: string,
  input: Omit<ProductInput, "slug">,
  token: string,
): Promise<Product> {
  return apiFetch<Product>(`/api/products/${slug}`, {
    method: "PUT",
    body: JSON.stringify(input),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteProduct(slug: string, token: string): Promise<void> {
  return apiFetch<void>(`/api/products/${slug}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
