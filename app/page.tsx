import { Hero } from "@/components/home/Hero";
import { NewArrivals } from "@/components/home/NewArrivals";
import { PromoBanner } from "@/components/home/PromoBanner";
import { WhyShopWithUs } from "@/components/home/WhyShopWithUs";
import { SocialGallery } from "@/components/home/SocialGallery";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <PromoBanner />
      <WhyShopWithUs />
      <SocialGallery />
    </>
  );
}