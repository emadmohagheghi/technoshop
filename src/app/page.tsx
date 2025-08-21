"use client";
import { HomeSlider } from "@/components/home-page/home-slider";
import { useBanner } from "@/hooks/use-benner";
import { useHeaderStore } from "@/stores/header-data.store";
import { CategorySlider } from "@/components/home-page/category-slider";
import { ProductCarousel } from "@/components/product-carousel";
import {
  useGetNewestProducts,
  useGetSpecialProducts,
} from "@/hooks/useProducts";
import { OffersCarousel } from "@/components/home-page/offers-carousel";

export default function Home() {
  const { data: banners = [], isFetching: isGettingBanners } = useBanner();
  const categories = useHeaderStore((state) => state.categories);
  const { data: newestProducts = [], isFetching: isGettingNewestProducts } =
    useGetNewestProducts();
  const { data: specialProducts = [], isFetching: isGettingSpecialProducts } =
    useGetSpecialProducts();

  return (
    <div className="">
      <div className="container space-y-6 p-3 lg:space-y-12">
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
      </div>
    </div>
  );
}
