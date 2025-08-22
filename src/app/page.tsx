"use client";
import { HomeSlider } from "@/components/home-page/home-slider";
import { useBanner } from "@/hooks/use-benner";
import { useHeaderStore } from "@/stores/header-data.store";
import { CategorySlider } from "@/components/home-page/category-slider";
import { ProductCarousel } from "@/components/product-carousel";
import {
  useGetNewestProducts,
  useGetSpecialProducts,
  useGetBestSellingProducts,
} from "@/hooks/useProducts";
import { OffersCarousel } from "@/components/home-page/offers-carousel";
import SecondHomeSlider from "@/components/home-page/second-home-slider";
import BrandCarousel from "@/components/home-page/brand-slider/brand-slider";
import WatchBanner from "@/components/home-page/watch-banner";
import FAQSection from "@/components/home-page/faq";
import Features from "@/components/home-page/features";

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
