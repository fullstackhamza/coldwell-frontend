import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { fetchProducts } from "@/lib/api/products";

export async function BestSellers() {
  const products = await fetchProducts({ collection: ["best-sellers"] });
  const items = products.slice(0, 8);

  return (
    <section className="container-page border-t border-line py-16">
      <SectionHeader title="Best Sellers" viewAllHref="/best-sellers" />
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {items.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
