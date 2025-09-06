"use client";

import { Button } from "@/app/_components/ui/button";
import { ShoppingCart, Add, Minus, Trash } from "iconsax-reactjs";
import { useCart } from "@/hooks/use-cart";
import { ProductDetail } from "@/types/product.types";
import { toast } from "sonner";

export default function AddToCart({
  short_slug,
}: Pick<ProductDetail, "short_slug">) {
  const { addOne, getQuantity, removeOne } = useCart();
  const quantity = getQuantity({ short_slug });

  if (quantity <= 0) {
    return (
      <Button
        className="bg-brand-primary hover:bg-brand-primary-focus w-60 py-8 text-sm font-bold lg:text-base"
        onClick={() => {
          addOne({ short_slug });
          toast("به سبد خرید اضافه شد");
        }}
      >
        افزودن به سبد خرید
        <ShoppingCart className="size-5 lg:size-6" color="white" />
      </Button>
    );
  }

  if (quantity > 0) {
    return (
      <div className="border-primary flex w-60 items-center justify-between rounded-lg border p-3 text-2xl">
        <Button variant="ghost" onClick={() => addOne({ short_slug })}>
          <Add color="var(--color-success)" className="size-5" />
        </Button>
        <span>{quantity}</span>
        <Button variant="ghost" onClick={() => removeOne({ short_slug })}>
          {quantity === 1 ? (
            <Trash color="var(--color-error)" className="size-5" />
          ) : (
            <Minus color="var(--color-error)" className="size-5" />
          )}
        </Button>
      </div>
    );
  }
}
