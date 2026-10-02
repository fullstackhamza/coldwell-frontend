import { BadgeCheck, Banknote, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const benefits = [
  { icon: BadgeCheck, label: "Premium Quality" },
  { icon: RotateCcw, label: "Easy Returns" },
  { icon: Truck, label: "Fast Delivery" },
  { icon: ShieldCheck, label: "Secure Payments" },
  { icon: Banknote, label: "Cash on Delivery" },
];

export function WhyShopWithUs() {
  return (
    <section className="container-page border-t border-line py-16">
      <div className="grid grid-cols-2 gap-y-8 md:grid-cols-5 md:gap-y-0">
        {benefits.map(({ icon: Icon, label }, index) => (
          <Reveal key={label} delay={index * 0.08} y={16}>
            <div className="flex flex-col items-center gap-2 text-center">
              <Icon size={22} strokeWidth={1.5} className="text-oxblood" />
              <span className="text-sm text-ink">{label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
