import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export function SectionHeader({
  eyebrow,
  title,
  viewAllHref,
}: {
  eyebrow?: string;
  title: string;
  viewAllHref?: string;
}) {
  return (
    <Reveal y={16}>
      <div className="flex items-end justify-between">
        <div>
          {eyebrow && (
            <p className="text-sm uppercase tracking-wide text-oxblood">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 font-display text-3xl text-ink md:text-4xl">
            {title}
          </h2>
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="border-b border-ink text-sm text-ink transition hover:border-oxblood hover:text-oxblood"
          >
            View All
          </Link>
        )}
      </div>
    </Reveal>
  );
}
