import { Product } from "@/types/product.types";
import Carousel from "@/app/_components/ui/carousel";
import ProductCard from "@/app/_components/ui/product-card";
import Timer from "./timer";
import Link from "next/link";
import { ArrowLeft2 } from "iconsax-reactjs";
import ProductCardSkeleton from "@/app/_components/ui/product-card-skeleton";

export default function OffersCarousel({
  products,
  isLoading,
}: {
  products: Product[];
  isLoading: boolean;
}) {
  // if (isLoading) {
  //   return <div className="bg-brand-primary h-90 w-full"></div>;
  // }
  return (
    <>
      <div className="bg-brand-primary rounded-2xl px-4 py-4 lg:py-6">
        <Carousel
          key={isLoading ? "loading" : "loaded"}
          rtl
          slides={{ perView: "auto", spacing: 8 }}
          className=""
        >
          <div className="flex h-full flex-col items-center justify-around px-1 lg:px-9">
            <h5 className="text-base font-medium text-white lg:text-4xl">
              تخفیف های
              <br />
              شگفت انگیز
            </h5>
            <Timer initialSeconds={3600} />
            <Link
              href="/products?special=true"
              className="flex content-end items-center self-start text-xs text-white lg:text-base"
            >
              مشاهده همه
              <ArrowLeft2 className="size-3 lg:size-4" />
            </Link>
          </div>
          {!isLoading &&
            products.map((item) => <ProductCard key={item.id} {...item} />)}
          {isLoading &&
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
