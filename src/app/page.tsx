"use client";
import { HomeSlider } from "@/app/_components/home-slider";
import { useBanner } from "@/hooks/use-benner";
import { useHeaderStore } from "@/stores/header-data.store";
import { CategorySlider } from "@/app/_components/category-slider";
import { ProductCarousel } from "@/app/_components/product-carousel";
import {
  useGetNewestProducts,
  useGetSpecialProducts,
  useGetBestSellingProducts,
} from "@/hooks/use-products";
import { OffersCarousel } from "@/app/_components/offers-carousel";
import SecondHomeSlider from "@/app/_components/second-home-slider";
import BrandCarousel from "@/app/_components/brand-slider/brand-slider";
import WatchBanner from "@/app/_components/watch-banner";
import FAQSection from "@/app/_components/faq";
import Features from "@/app/_components/features";

export default function Home() {
  const { data: banners = [], isFetching: isGettingBanners } = useBanner();
  const categories = useHeaderStore((state) => state.categories);
  const brands = useHeaderStore((state) => state.brands);
  const { data: newestProducts = [], isFetching: isGettingNewestProducts } =
    useGetNewestProducts();
  const { data: specialProducts = [], isFetching: isGettingSpecialProducts } =
    useGetSpecialProducts();
  const {
    data: bestSellingProducts = [],
    isFetching: isGettingBestSellingProducts,
  } = useGetBestSellingProducts();

  return (
    <div className="">
      <div className="container mb-6 space-y-6 p-3 lg:space-y-12">
        <HomeSlider banners={banners} isLoading={isGettingBanners} />

        <CategorySlider categories={categories} />

        <OffersCarousel
          products={specialProducts}
          isLoading={isGettingSpecialProducts}
        />

        <ProductCarousel
          isLoading={isGettingNewestProducts}
          products={newestProducts}
          title="جدیدترین محصولات"
          link="/"
        />

        <SecondHomeSlider />

        <ProductCarousel
          isLoading={isGettingBestSellingProducts}
          products={bestSellingProducts}
          title="پیشنهادات"
        />

        <BrandCarousel brands={brands} />

        <WatchBanner />

        <FAQSection />

        <Features />
      </div>
    </div>
  );
}
