"use client";
import HomeSlider from "@/components/home-page/home-slider/home-slider";
import { useBanner } from "@/hooks/use-benner";

export default function Home() {
  const { data: banners = [], isFetching: isGettingBanners } = useBanner();

  return (
    <div className="mx-auto h-999 max-w-[1272px] p-4 lg:p-6">
      <HomeSlider banners={banners} isLoading={isGettingBanners} />
    </div>
  );
}
