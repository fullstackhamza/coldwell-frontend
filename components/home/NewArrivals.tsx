import Link from "next/link";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { fetchProducts } from "@/lib/api/products";

// How many products to show on the homepage. The rest are on the
// "View all" page.
const HOME_LIMIT = 8;

export async function NewArrivals() {
  const products = await fetchProducts({ collection: ["new-arrivals"] });

  // Newest first. The list comes back oldest-first, so flip it, then sort by
  // date. Products added on the same day keep the flipped order, which puts
  // the one you added last on top.
  const items = [...products]
    .reverse()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, HOME_LIMIT);

  return (
    <section className="container-page border-t border-line py-16">
      <SectionHeader
        eyebrow="Just In"
        title="New Arrivals"
        viewAllHref="/new-arrivals"
      />
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {items.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/new-arrivals"
          className="inline-block rounded-sm border border-ink px-8 py-3 text-sm uppercase tracking-wide text-ink transition hover:bg-ink hover:text-paper"
        >
          View all new arrivals
        </Link>
      </div>
    </section>
  );
}
