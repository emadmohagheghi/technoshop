import {
  BrandCarousel,
  CategoryCarousel,
  FAQSection,
  Features,
  HomeSlider,
  OffersCarousel,
  SecondHomeSlider,
  WatchBanner,
  RecommendedProducts,
  NewestProducts,
} from "@/app/_components/home-components";

export default function Home() {
  return (
    <div>
      <div className="container mb-6 space-y-6 p-3 lg:space-y-12">
        <HomeSlider />

        <CategoryCarousel />

        <OffersCarousel />

        <NewestProducts />

        <SecondHomeSlider />

        <RecommendedProducts />

        <BrandCarousel />

        <WatchBanner />

        <FAQSection />

        <Features />
      </div>
    </div>
  );
}
