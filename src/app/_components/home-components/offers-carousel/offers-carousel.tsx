"use client";
import Carousel from "@/app/_components/ui/carousel";
import ProductCard from "@/app/_components/ui/product-card";
import Timer from "./timer";
import Link from "next/link";
import { ArrowLeft2 } from "iconsax-reactjs";
import ProductCardSkeleton from "@/app/_components/ui/product-card-skeleton";
import { useGetSpecialProducts } from "@/hooks/use-products";

export default function OffersCarousel() {
  const { data: products = [], isFetching, isError } = useGetSpecialProducts();
  return (
    <>
      <div className="bg-brand-primary rounded-2xl px-4 py-4 lg:py-6">
        <Carousel
          key={isFetching ? "loading" : "loaded"}
          rtl
          slides={{ perView: "auto", spacing: 8 }}
          className=""
        >
          <div className="flex h-full flex-col items-center justify-around px-1 lg:px-9">
            <h2 className="text-base font-medium text-white lg:text-4xl">
              تخفیف های
              <br />
              شگفت انگیز
            </h2>
            <Timer initialSeconds={3600} />
            <Link
              href="/products?special=true"
              className="flex content-end items-center self-start text-xs text-white lg:text-base"
              aria-label="مشاهده همه تخفیف‌های شگفت‌انگیز"
            >
              مشاهده همه
              <ArrowLeft2 className="size-3 lg:size-4" aria-hidden="true" />
            </Link>
          </div>
          {!isFetching &&
            !isError &&
            products.map((item) => <ProductCard key={item.id} {...item} />)}
          {(isFetching || isError) &&
            Array(8)
              .fill(true)
              .map((_, index) => (
                <ProductCardSkeleton key={`skeleton-${index}`} />
              ))}
        </Carousel>
      </div>
    </>
  );
}
