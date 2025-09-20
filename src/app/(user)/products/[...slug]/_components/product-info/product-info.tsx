import { Rating } from "@/app/_components/ui/rating";
import { ProductDetail } from "@/types/product.types";
import { Verify } from "iconsax-reactjs";
import Comparison from "../comparison";
import AddToCart from "../add-to-cart";

export default function ProductInfo({
  title_en,
  title_ir,
  stockrecord,
  short_slug,
}: ProductDetail) {
  const { special_sale_price, sale_price } = stockrecord;
  return (
    <div className="flex w-full flex-col gap-3 pt-10">
      <h1 className="text-xl font-bold lg:font-medium">{title_ir}</h1>
      <h2 className="text-sm text-gray-700">{title_en}</h2>
      <div className="flex w-fit items-center gap-1 border-gray-300 pb-3 lg:border-b">
        <p className="text-base font-medium text-gray-700 lg:text-sm">
          امتیاز کاربران:
        </p>
        <Rating className="w-24" rate={4} />
      </div>
      <div className="w-fit space-y-2 border-gray-300 pb-3 lg:border-b">
        <p className="text-base font-medium lg:text-sm lg:font-bold">
          رنگ: مشکی
        </p>
        <div className="size-8 rounded bg-black lg:size-6" />
      </div>
      <div className="flex items-center gap-1 text-base font-medium lg:text-xs">
        <Verify className="size-8 lg:size-6" color="var(--color-primary)" />
        <p>گارانتی ۱۸ ماهه آروند</p>
      </div>
      <p className="space-x-1">
        <span className="text-sm font-medium lg:text-xs">تومان</span>
        <span className="text-xl font-bold lg:font-semibold">
          {special_sale_price
            ? special_sale_price.toLocaleString()
            : sale_price.toLocaleString()}
        </span>
      </p>
      <div className="flex w-full gap-3">
        <AddToCart short_slug={short_slug} />
        <Comparison />
      </div>
    </div>
  );
}
