import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export function PromoBanner() {
  return (
    <section className="border-t border-line bg-ink py-20 text-center text-paper">
      <Reveal>
        <p className="text-sm uppercase tracking-wide text-paper/70">
          Limited Time
        </p>
        <h2 className="mt-2 font-display text-4xl italic md:text-5xl">
          Up to 40% Off
        </h2>
        <Link
          href="/sale"
          className="mt-7 inline-block rounded-sm bg-paper px-8 py-3 text-sm uppercase tracking-wide text-ink transition hover:bg-oxblood hover:text-paper"
        >
          Shop Sale
        </Link>
      </Reveal>
    </section>
  );
}
