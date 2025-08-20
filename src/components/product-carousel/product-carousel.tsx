import { Product } from "@/types/product.types";
import Link from "next/link";
import { ArrowLeft2 } from "iconsax-reactjs";
import Carousel from "@/components/ui/carousel";
import ProductCard from "@/components/ui/product-card";
import ProductCardSkeleton from "@/components/ui/product-card-skeleton";

type ProductCarouselProps = {
  products: Product[];
  title?: string;
  link?: string;
  isLoading: boolean;
};
export default function ProductCarousel({
  products,
  link,
  title,
  isLoading,
}: ProductCarouselProps) {
  return (
    <div className="flex flex-col gap-4">
      {title && (
        <div className="text-brand-primary flex w-full items-center justify-between">
          <h3 className="text-2xl font-bold lg:text-3xl lg:font-medium">
            {title}
          </h3>
          {link && (
            <Link className="flex items-center text-xs lg:text-lg" href={link}>
              مشاهده همه
              <ArrowLeft2 className="size-[14px] lg:size-[20px]" />
            </Link>
          )}
        </div>
      )}
      <Carousel
        key={isLoading ? "loading" : "loaded"}
        rtl
        slides={{ perView: "auto", spacing: 8 }}
      >
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
  );
}
