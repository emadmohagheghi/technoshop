import { Product } from "@/types/product.types";
import { calculateDiscountPercentage, imageUrl } from "@/utils/product";
import { Heart } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProductCard({
  image,
  stockrecord,
  title_ir,
  isFavorite,
  url,
}: Product) {
  const { sale_price, special_sale_price } = stockrecord;
  const discountPercentage = calculateDiscountPercentage(
    sale_price,
    special_sale_price || 0,
  );

  return (
    <Link className="w-full" href={url}>
      <Card className="gap-2 px-3.5 py-4 shadow-none bg-white w-full">
        <CardHeader className="flex h-4 items-center justify-between p-0">
          <Heart
            size={16}
            color="#5E0A8E"
            className={cn("transition-colors", {
              "fill-brand-primary": isFavorite,
            })}
          />
          {discountPercentage && (
            <span className="bg-error flex h-4 w-8.5 items-center justify-center rounded-full text-[10px] font-bold text-white">
              {discountPercentage}%
            </span>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-2 p-0">
          <Image
            src={imageUrl(image)}
            alt={title_ir}
            width={256}
            height={256}
            className="aspect-square w-full h-full rounded-md object-cover mx-auto mix-blend-multiply"
          />
          <CardTitle className="line-clamp-2 p-0 text-center text-xs leading-[140%] font-medium">
            {title_ir}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex-col gap-2 p-0 self-end">
          <div className="h-3.5 text-sm text-gray-600 line-through">
            {special_sale_price && sale_price.toLocaleString()}
          </div>
          <div className="bg-brand-primary space-x-1 text-sm font-bold p-1 rounded text-white">
            <span>
              {special_sale_price
                ? special_sale_price.toLocaleString()
                : sale_price.toLocaleString()}
            </span>
            <span>تومان</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
