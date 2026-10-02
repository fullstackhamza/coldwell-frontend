"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchProducts, deleteProduct } from "@/lib/api/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductsTable() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  async function handleDelete(slug: string) {
    if (!token) return;
    if (!confirm(`Delete this product? This can't be undone.`)) return;
    setError(null);
    setDeletingSlug(slug);
    try {
      await deleteProduct(slug, token);
      setProducts((prev) => prev?.filter((p) => p.slug !== slug) ?? null);
    } catch {
      setError("Couldn't delete that product. Please try again.");
    } finally {
      setDeletingSlug(null);
    }
  }

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-ink px-5 py-2.5 text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood"
        >
          Add Product
        </Link>
      </div>

      {error && <p className="mt-4 text-sm text-oxblood">{error}</p>}

      {products === null ? (
        <div className="py-16" />
      ) : products.length === 0 ? (
        <p className="mt-10 text-sm text-ink-soft">No products yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-soft">
                <th className="py-2 pr-4 font-normal">Photo</th>
                <th className="py-2 pr-4 font-normal">Name</th>
                <th className="py-2 pr-4 font-normal">Category</th>
                <th className="py-2 pr-4 font-normal">Price</th>
                <th className="py-2 pr-4 font-normal">Stock</th>
                <th className="py-2 pr-4 font-normal">Flags</th>
                <th className="py-2 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const outOfStockCount = product.unavailableSizes?.length ?? 0;
                return (
                  <tr key={product.slug} className="border-b border-line">
                    <td className="py-3 pr-4">
                      {product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element --
                        // small admin-only thumbnail from an arbitrary URL
                        // (local upload or seeded remote URL); not worth the
                        // next/image remotePatterns overhead for a 40px preview.
                        <img
                          src={product.images[0]}
                          alt=""
                          className="h-10 w-10 border border-line object-cover"
                        />
                      ) : (
                        <div
                          className="h-10 w-10 border border-line bg-sand"
                          title="No photo uploaded"
                        />
                      )}
                    </td>
                    <td className="py-3 pr-4 text-ink">{product.name}</td>
                    <td className="py-3 pr-4 text-ink-soft">
                      {product.category} / {product.subcategory}
                    </td>
                    <td className="py-3 pr-4 text-ink">
                      {formatPrice(product.price)}
                      {product.compareAtPrice && (
                        <span className="ml-1 text-xs text-oxblood">Sale</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-ink-soft">
                      {outOfStockCount > 0
                        ? `${outOfStockCount} size${outOfStockCount > 1 ? "s" : ""} out`
                        : "In stock"}
                    </td>
                    <td className="py-3 pr-4 text-ink-soft">
                      {[
                        product.isNewArrival && "New",
                        product.isBestSeller && "Best Seller",
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/products/${product.slug}/edit`}
                          className="border-b border-ink text-ink transition hover:border-oxblood hover:text-oxblood"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.slug)}
                          disabled={deletingSlug === product.slug}
                          className="border-b border-ink-soft text-ink-soft transition hover:border-oxblood hover:text-oxblood disabled:opacity-50"
                        >
                          {deletingSlug === product.slug ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
