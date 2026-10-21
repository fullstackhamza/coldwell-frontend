import { Hero } from "@/components/home/Hero";
import { NewArrivals } from "@/components/home/NewArrivals";
import { BestSellers } from "@/components/home/BestSellers";
import { PromoBanner } from "@/components/home/PromoBanner";
import { WhyShopWithUs } from "@/components/home/WhyShopWithUs";
import { SocialGallery } from "@/components/home/SocialGallery";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <BestSellers />
      <PromoBanner />
      <WhyShopWithUs />
      <SocialGallery />
    </>
  );
}