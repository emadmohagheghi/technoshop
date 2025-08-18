"use client";
import { HomeSlider } from "@/components/home-page/home-slider";
import { useBanner } from "@/hooks/use-benner";
import { useHeaderStore } from "@/stores/header-data.store";
import { CategorySlider } from "@/components/home-page/category-slider";

export default function Home() {
  const { data: banners = [], isFetching: isGettingBanners } = useBanner();
  const categories = useHeaderStore((state) => state.categories);

  return (
    <div className="container mx-auto h-500 space-y-6 p-3 lg:space-y-12">
      <HomeSlider banners={banners} isLoading={isGettingBanners} />
      <CategorySlider categories={categories} />
    </div>
  );
}
