"use client";

import { Product } from "@/types/product.types";
import { calculateDiscountPercentage, imageUrl } from "@/utils/product";
import { Heart } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useFavoritesStore } from "@/stores/favorites.store";
import { useUserStore } from "@/stores/user.store";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";

export default function ProductCard({
  id,
  image,
  stockrecord,
  title_ir,
  isFavorite: initialIsFavorite,
  url,
  classname,
}: Product & { classname?: string }) {
  const authStatus = useUserStore((state) => state.status);
  const favoritesStatus = useFavoritesStore((state) => state.status);
  const initializeFavorites = useFavoritesStore((state) => state.initialize);
  const toggleFavorite = useFavoritesStore((state) => state.toggle);
  const favoriteFromStore = useFavoritesStore((state) => state.isFavorite(id));
  const isPending = useFavoritesStore((state) => state.isPending(id));
  const isFavorite =
    favoritesStatus === "ready"
      ? favoriteFromStore
      : Boolean(initialIsFavorite);
  const isFavoriteDisabled =
    authStatus === "loading" ||
    favoritesStatus === "loading" ||
    favoritesStatus === "idle" ||
    isPending;
  const { sale_price, special_sale_price } = stockrecord;
  const discountPercentage = calculateDiscountPercentage(
    sale_price,
    special_sale_price || 0,
  );

  const handleFavoriteClick = async () => {
    if (favoritesStatus === "error") {
      const initialized = await initializeFavorites(
        authStatus === "authenticated",
      );
      if (!initialized) {
        toast.error("دریافت علاقه‌مندی‌ها ناموفق بود؛ دوباره تلاش کنید");
      }
      return;
    }

    const success = await toggleFavorite(id);
    if (!success) {
      toast.error("به‌روزرسانی علاقه‌مندی‌ها ناموفق بود");
    }
  };

  return (
    <Card
      className={cn(
        classname,
        "w-[119px] gap-0 bg-white p-2 shadow-none lg:w-[184px] lg:gap-2 lg:px-3.5 lg:py-4",
      )}
    >
      <CardHeader className="flex h-4 items-center justify-between p-0">
        <button
          type="button"
          className="relative z-10 inline-flex rounded-full transition-transform hover:scale-110 disabled:cursor-default disabled:opacity-60"
          disabled={isFavoriteDisabled}
          aria-label={
            isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
          }
          aria-pressed={isFavorite}
          onClick={() => void handleFavoriteClick()}
        >
          <Heart
            size={16}
            color="#5E0A8E"
            className={cn("transition-colors", {
              "fill-brand-primary": isFavorite,
            })}
            aria-hidden
          />
        </button>
        {discountPercentage && (
          <span className="bg-error flex h-4 w-8.5 items-center justify-center rounded-full text-[10px] font-bold text-white">
            {discountPercentage}%
          </span>
        )}
      </CardHeader>
      <Link className="flex flex-1 flex-col gap-0 lg:gap-2" href={url}>
        <CardContent className="flex flex-col p-0 lg:gap-2">
          <Image
            src={imageUrl(image)}
            alt={title_ir}
            width={256}
            height={256}
            className="mx-auto aspect-square h-full w-full rounded-md object-cover mix-blend-multiply"
          />
          <CardTitle className="line-clamp-2 h-8 p-0 text-center text-[10px] leading-[140%] font-medium lg:text-xs">
            {title_ir}
          </CardTitle>
        </CardContent>
        <CardFooter className="mt-auto flex-col gap-0 self-end p-0 text-[10px] lg:gap-2 lg:text-sm">
          <div className="mr-auto ml-2 h-3.5 text-gray-600 line-through">
            {special_sale_price && sale_price.toLocaleString()}
          </div>
          <div className="bg-brand-primary space-x-1 rounded p-1 font-bold text-white">
            <span>
              {special_sale_price
                ? special_sale_price.toLocaleString()
                : sale_price.toLocaleString()}
            </span>
            <span>تومان</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
