import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

const categories = [
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "T-Shirts", href: "/men/t-shirts" },
  { label: "Shirts", href: "/men/shirts" },
  { label: "Jeans", href: "/men/jeans" },
  { label: "Hoodies", href: "/men/hoodies" },
  { label: "Jackets", href: "/men/jackets" },
  { label: "Accessories", href: "/men/accessories" },
];

export function ShopByCategory() {
  return (
    <section className="container-page border-t border-line py-16">
      <Reveal>
        <h2 className="font-display text-3xl text-ink md:text-4xl">
          Shop By Category
        </h2>
      </Reveal>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category, index) => (
          <Reveal key={category.href} delay={Math.min((index % 4) * 0.06, 0.24)}>
            <Link
              href={category.href}
              className="group relative flex aspect-[4/5] items-end overflow-hidden bg-sand p-4 transition-colors hover:bg-[#E4DCC8]"
            >
              <span className="text-sm uppercase tracking-wide text-ink underline decoration-transparent underline-offset-4 transition group-hover:decoration-ink">
                {category.label}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
