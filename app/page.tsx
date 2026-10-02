import { Hero } from "@/components/home/Hero";
import { NewArrivals } from "@/components/home/NewArrivals";
import { ShopByCategory } from "@/components/home/ShopByCategory";
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
      <ShopByCategory />
      <BestSellers />
      <PromoBanner />
      <WhyShopWithUs />
      <SocialGallery />
    </>
  );
}
