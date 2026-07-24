"use client";

import { Button } from "@/app/_components/ui/button";
import { useCartStore } from "@/stores/cart.store";
import { Add, Minus, ShoppingCart, Trash } from "iconsax-reactjs";
import { toast } from "sonner";

type AddToCartProps = {
  short_slug: number;
  maxQuantity: number;
};

const labels = {
  add: "\u0627\u0641\u0632\u0648\u062f\u0646 \u0628\u0647 \u0633\u0628\u062f \u062e\u0631\u06cc\u062f",
  added:
    "\u0628\u0647 \u0633\u0628\u062f \u062e\u0631\u06cc\u062f \u0627\u0636\u0627\u0641\u0647 \u0634\u062f",
  failed:
    "\u0628\u0647\u200c\u0631\u0648\u0632\u0631\u0633\u0627\u0646\u06cc \u0633\u0628\u062f \u062e\u0631\u06cc\u062f \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062f",
  loading:
    "\u062f\u0631 \u062d\u0627\u0644 \u0628\u0627\u0631\u06af\u0630\u0627\u0631\u06cc",
  unavailable: "\u0646\u0627\u0645\u0648\u062c\u0648\u062f",
};

export default function AddToCart({ short_slug, maxQuantity }: AddToCartProps) {
  const quantity = useCartStore((state) => state.getQuantity(short_slug));
  const setQuantity = useCartStore((state) => state.setQuantity);
  const cartStatus = useCartStore((state) => state.status);
  const isPending = useCartStore((state) => state.isPending(short_slug));
  const isReady = cartStatus === "ready";
  const canIncrease = quantity < maxQuantity;
  const isDisabled = !isReady || isPending;

  const updateQuantity = async (
    nextQuantity: number,
    successMessage?: string,
  ) => {
    const success = await setQuantity(short_slug, nextQuantity);
    if (!success) {
      toast.error(labels.failed);
      return;
    }
    if (successMessage) toast.success(successMessage);
  };

  if (maxQuantity <= 0) {
    return (
      <Button className="xs:w-60 py-8" disabled>
        {labels.unavailable}
      </Button>
    );
  }

  if (quantity === 0) {
    return (
      <Button
        className="bg-brand-primary hover:bg-brand-primary-focus xs:w-60 py-8 text-sm font-bold lg:text-base"
        disabled={isDisabled}
        onClick={() => void updateQuantity(1, labels.added)}
      >
        {isReady ? labels.add : labels.loading}
        <ShoppingCart className="size-5 lg:size-6" color="white" />
      </Button>
    );
  }

  return (
    <div className="border-primary flex w-60 items-center justify-between rounded-lg border p-3 text-2xl">
      <Button
        variant="ghost"
        disabled={isDisabled || !canIncrease}
        onClick={() => void updateQuantity(quantity + 1)}
        aria-label="increase cart quantity"
      >
        <Add color="var(--color-success)" className="size-5" />
      </Button>
      <span aria-live="polite">{quantity}</span>
      <Button
        variant="ghost"
        disabled={isDisabled}
        onClick={() => void updateQuantity(quantity - 1)}
        aria-label="decrease cart quantity"
      >
        {quantity === 1 ? (
          <Trash color="var(--color-error)" className="size-5" />
        ) : (
          <Minus color="var(--color-error)" className="size-5" />
        )}
      </Button>
    </div>
  );
}
