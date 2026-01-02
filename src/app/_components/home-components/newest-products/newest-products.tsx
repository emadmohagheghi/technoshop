"use client";
import { useGetNewestProducts } from "@/hooks/use-products";
import { ProductCarousel } from "../../product-carousel";

export default function NewestProducts() {
  const { data = [], isFetching, isError } = useGetNewestProducts();
  return (
    <ProductCarousel
      isLoading={isFetching || isError}
      products={data}
      title="جدیدترین محصولات"
      link="/"
    />
  );
}
