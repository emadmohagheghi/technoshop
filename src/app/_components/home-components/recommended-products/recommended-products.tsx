"use client";
import { useGetBestSellingProducts } from "@/hooks/use-products";
import { ProductCarousel } from "../../product-carousel";

export default function RecommendedProducts() {
  const { data = [], isFetching, isError } = useGetBestSellingProducts();
  return (
    <ProductCarousel
      isLoading={isFetching || isError}
      products={data}
      title="پیشنهادات"
    />
  );
}
