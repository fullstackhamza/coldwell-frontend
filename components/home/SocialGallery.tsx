import { Instagram } from "lucide-react";
import { SITE_NAME } from "@/lib/site-config";
import { Reveal } from "@/components/motion/Reveal";

export function SocialGallery() {
  const tiles = Array.from({ length: 6 });

  return (
    <section className="container-page border-t border-line py-16">
      <div className="flex items-center justify-center gap-2">
        <Instagram size={18} strokeWidth={1.5} className="text-ink" />
        <p className="text-sm uppercase tracking-wide text-ink">
          Follow @{SITE_NAME.toLowerCase().replace(/\s+/g, "")}
        </p>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-2 md:grid-cols-6">
        {tiles.map((_, index) => (
          <Reveal key={index} delay={Math.min(index * 0.06, 0.3)} y={16}>
            <div className="aspect-square bg-sand" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
