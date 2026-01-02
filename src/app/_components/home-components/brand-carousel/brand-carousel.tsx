import Carousel from "@/app/_components/ui/carousel";
import { Brand } from "@/types/brand.types";
import { imageUrl } from "@/utils/product";
import Image from "next/image";
import Link from "next/link";

export default function BrandCarousel({ brands }: { brands: Brand[] }) {
  return (
    <div>
      <h2 className="border-brand-primary text-brand-primary border-b-2 text-2xl font-bold lg:text-3xl lg:font-medium">
        محبوب ترین برند ها
      </h2>
      <Carousel
        className="items-center"
        rtl
        slides={{ perView: "auto", spacing: 30 }}
      >
        {brands.map((brand) => (
          <div key={brand.id} className="flex justify-center">
            <Link
              href={"/products?brand=" + brand.slug}
              className="w-25 lg:w-44"
            >
              <Image
                src={imageUrl(brand.image.name)}
                alt={brand.title_en}
                width={175}
                height={175}
              />
            </Link>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
