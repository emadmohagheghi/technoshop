"use client";
import { useGetProductByShortSlug } from "@/hooks/use-products";
import { ProductDetail } from "@/types/product.types";
import { Button } from "@/app/_components/ui/button";
import Image from "next/image";
import { imageUrl } from "@/utils/product";
import {
  DollarCircle,
  Trash,
  Minus,
  Add,
  ShieldTick,
  TruckFast,
} from "iconsax-reactjs";
import Link from "next/link";

export default function ProductCard({
  short_slug,
  quantity,
  onUpdateQuantity,
  onRemove,
}: {
  short_slug: Pick<ProductDetail, "short_slug">;
  quantity: number;
  onUpdateQuantity: (newQuantity: number) => void;
  onRemove: () => void;
}) {
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByShortSlug(short_slug.short_slug);

  if (isLoading) {
    return (
      <div className="flex animate-pulse items-center gap-4 rounded-2xl border bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="h-24 w-24 rounded-xl bg-gray-200"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-3 w-1/2 rounded bg-gray-200"></div>
          <div className="h-4 w-1/4 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 p-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-red-200">
          <span className="text-sm text-red-500">خطا</span>
        </div>
        <div className="flex-1">
          <p className="font-medium text-red-600">محصول یافت نشد</p>
        </div>
      </div>
    );
  }

  const hasSpecialPrice =
    product.stockrecord.special_sale_price &&
    product.stockrecord.special_sale_price < product.stockrecord.sale_price;

  const finalPrice = hasSpecialPrice
    ? product.stockrecord.special_sale_price
    : product.stockrecord.sale_price;

  return (
    <div className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row">
      <div className="sm:w-1/3">
        <Link href={product.url} className="">
          <Image
            src={imageUrl(product.images[0].image.name)}
            alt={product.title_ir}
            width={512}
            height={512}
            className=""
          />
        </Link>
        <div className="mx-auto flex w-fit">
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateQuantity(quantity + 1)}
              className="h-6 w-6 cursor-pointer p-0"
              disabled={
                product.stockrecord.in_order_limit
                  ? quantity >= product.stockrecord.in_order_limit
                  : false
              }
            >
              <Add className="text-success h-3 w-3" />
            </Button>
            <span className="min-w-[2rem] px-2 text-center text-sm font-medium">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
              className="h-6 w-6 cursor-pointer p-0"
              disabled={quantity <= 1}
            >
              <Minus className="text-error h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 cursor-pointer p-0"
          >
            <Trash className="text-error h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-4 p-2 sm:w-2/3">
        <h2 className="text-lg lg:text-xl">{product.title_ir}</h2>
        <div className="space-y-2 text-sm text-gray-700 *:flex *:items-center *:gap-1">
          <div>
            <ShieldTick className="inline-block h-4 w-4" />
            <p>گارانتی سلامت کالا</p>
          </div>
          <div>
            <DollarCircle className="inline-block h-4 w-4" />
            <p>ارسال رایگان</p>
          </div>
          <div>
            <TruckFast className="inline-block h-4 w-4" />
            <p>ارسال امروز</p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-sm text-gray-700">
          {hasSpecialPrice && (
            <h5 className="text-error text-sm font-bold line-through">
              {product.stockrecord.special_sale_price.toLocaleString()}
            </h5>
          )}
          <h5 className="text-base font-bold text-black">
            {finalPrice.toLocaleString()}
            تومان
          </h5>
        </div>
        <div className="space-x-1">
          <span>قیمت کل:</span>
          <span>{(finalPrice * quantity).toLocaleString()}</span>
          <span>تومان</span>
        </div>
      </div>
    </div>
  );
}
