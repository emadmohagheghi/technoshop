"use client";

import { ShoppingCart, Add, Minus, Trash } from "iconsax-reactjs";
import { useCartStore } from "@/stores/cart.store";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { useGetProductByShortSlug } from "@/hooks/use-products";
import { imageUrl } from "@/utils/product";

function CartItem({
  short_slug,
  quantity,
}: {
  short_slug: number;
  quantity: number;
}) {
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByShortSlug(short_slug);
  const addOne = useCartStore((state) => state.addOne);
  const removeOne = useCartStore((state) => state.removeOne);

  if (isLoading) {
    return (
      <div className="flex animate-pulse items-center gap-3 p-3">
        <div className="size-16 rounded bg-gray-200"></div>
        <div className="flex-1">
          <div className="mb-2 h-4 rounded bg-gray-200"></div>
          <div className="h-3 w-2/3 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center gap-3 p-3">
        <div className="flex size-16 items-center justify-center rounded bg-gray-100">
          <span className="text-xs text-gray-400">خطا</span>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">خطا در بارگذاری محصول</p>
        </div>
      </div>
    );
  }

  const { special_sale_price, sale_price } = product.stockrecord;
  const finalPrice =
    special_sale_price && special_sale_price > 0
      ? special_sale_price
      : sale_price;

  return (
    <div className="flex items-start gap-3 border-b border-gray-100 p-3 last:border-b-0">
      <div className="relative size-16 overflow-hidden rounded bg-gray-50">
        {product.images && product.images.length > 0 ? (
          <Image
            src={imageUrl(product.images[0].image.name)}
            alt={product.title_ir}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <ShoppingCart size="24" className="text-gray-400" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-medium text-gray-900">
          {product.title_ir}
        </h4>
        <p className="truncate text-xs text-gray-500">{product.title_en}</p>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-gray-900">
              {(finalPrice * quantity).toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">تومان</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="size-8 p-0"
              onClick={() => addOne({ short_slug })}
            >
              <Add size="16" color="var(--color-success)" />
            </Button>

            <span className="min-w-[20px] text-center text-sm">{quantity}</span>

            <Button
              variant="ghost"
              size="sm"
              className="size-8 p-0"
              onClick={() => removeOne({ short_slug })}
            >
              {quantity === 1 ? (
                <Trash size="16" color="var(--color-error)" />
              ) : (
                <Minus size="16" color="var(--color-error)" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartBtn() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const cart = useCartStore((state) => state.cart);
  const router = useRouter();
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const handleViewCart = () => {
    setPopoverOpen(false);
    router.push("/checkout/cart");
  };

  return (
    <>
      <div className="hidden lg:block">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="relative cursor-pointer">
              <ShoppingCart size="32" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 lg:w-96" align="end">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">سبد خرید</h3>
                <span className="text-sm text-gray-500">{totalItems} آیتم</span>
              </div>

              {cart.length === 0 ? (
                <div className="py-8 text-center">
                  <ShoppingCart
                    size="48"
                    className="mx-auto mb-3 text-gray-300"
                  />
                  <p className="text-gray-500">سبد خرید شما خالی است</p>
                </div>
              ) : (
                <>
                  <div className="max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <CartItem
                        key={item.short_slug}
                        short_slug={item.short_slug}
                        quantity={item.quantity}
                      />
                    ))}
                  </div>

                  <div className="border-t pt-3">
                    <Button
                      className="bg-brand-primary hover:bg-brand-primary-focus w-full"
                      onClick={handleViewCart}
                    >
                      مشاهده سبد خرید
                    </Button>
                  </div>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
