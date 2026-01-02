"use client";
import Carousel from "@/app/_components/ui/carousel";
import { Category } from "@/types/categories.types";
import Link from "next/link";
import Image from "next/image";
import { imageUrl } from "@/utils/product";
import { Skeleton } from "@/app/_components/ui/skeleton";

type CategoryCarouselProps = {
  categories: Category[];
};

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  if (categories.length <= 0) {
    return (
      <div className="flex items-center justify-start gap-6 overflow-hidden *:shrink-0">
        {Array(6)
          .fill(true)
          .map((_, index) => (
            <Skeleton
              key={index}
              className="aspect-square w-[88px] sm:w-[184px]"
            />
          ))}
      </div>
    );
  }
  return (
    <>
      <Carousel
        className="*:!w-[88px] *:shrink-0 *:sm:!w-[184px]"
        slides={{ perView: "auto", spacing: 24 }}
        rtl
      >
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className="bg- flex w-full flex-col items-center justify-center gap-3"
          >
            <Image
              src={imageUrl(category.image.name)}
              alt={category.title_en}
              width={117}
              height={117}
              className="aspect-square w-full max-w-[117px] object-contain"
            />

            <h2 className="text-center text-xs lg:text-xl">
              {category.title_ir}
            </h2>
          </Link>
        ))}
      </Carousel>
    </>
  );
}
