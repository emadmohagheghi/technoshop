"use client";
import { useHeaderStore } from "@/stores/header-data.store";
import { ProductCarousel } from "@/app/_components/product-carousel";
import {
  useGetNewestProducts,
  useGetSpecialProducts,
  useGetBestSellingProducts,
} from "@/hooks/use-products";
import {
  BrandCarousel,
  CategoryCarousel,
  FAQSection,
  Features,
  HomeSlider,
  OffersCarousel,
  SecondHomeSlider,
  WatchBanner,
} from "@/app/_components/home-components";

export default function Home() {
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
        <HomeSlider />

        <CategoryCarousel categories={categories} />

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
