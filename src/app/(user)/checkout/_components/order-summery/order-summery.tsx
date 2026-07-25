"use client";

import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import SpinnerLoading from "@/app/_components/ui/spinner-loading";
import { profileQueryKeys } from "@/lib/profile-queries";
import { confirmCheckout } from "@/services/checkout-service";
import { useCartStore, type CartItem } from "@/stores/cart.store";
import type { CheckoutState } from "@/types/checkout.types";
import type { ProductDetail } from "@/types/product.types";
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

interface OrderSummaryProps {
  cart: CartItem[];
  products: ProductDetail[];
  checkout?: CheckoutState;
  checkoutError: boolean;
  authStatus: "authenticated" | "unauthenticated" | "loading";
}

export default function OrderSummary({
  cart,
  products,
  checkout,
  checkoutError,
  authStatus,
}: OrderSummaryProps) {
  const router = useRouter();
  const currentPath = usePathname();
  const queryClient = useQueryClient();
  const refreshCart = useCartStore((state) => state.refresh);
  const checkoutSelectionIsPending =
    useIsMutating({ mutationKey: ["checkout", "selection"] }) > 0;
  const clientTotal = cart.reduce((total, cartItem) => {
    const product = products.find(
      (item) => item.short_slug === cartItem.short_slug,
    );
    if (!product) return total;
    const specialPrice = product.stockrecord.special_sale_price;
    const unitPrice =
      specialPrice && specialPrice < product.stockrecord.sale_price
        ? specialPrice
        : product.stockrecord.sale_price;
    return total + unitPrice * cartItem.quantity;
  }, 0);
  const totalItems =
    checkout?.item_count ??
    cart.reduce((total, item) => total + item.quantity, 0);
  const itemsTotal = checkout?.summary.items_total ?? clientTotal;
  const finalTotal = checkout?.summary.payable ?? clientTotal;
  const hasItems = checkout ? checkout.item_count > 0 : cart.length > 0;

  const confirmOrder = useMutation({
    mutationFn: confirmCheckout,
    onSuccess: async (confirmation) => {
      await refreshCart();
      queryClient.removeQueries({ queryKey: ["checkout"] });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: profileQueryKeys.orders }),
        queryClient.invalidateQueries({ queryKey: profileQueryKeys.dashboard }),
      ]);
      toast.success("سفارش با موفقیت ثبت شد");
      router.replace(confirmation.redirect_to);
    },
    onError: () =>
      toast.error("ثبت سفارش ناموفق بود؛ اطلاعات را دوباره بررسی کنید"),
  });

  const isCartStep = currentPath.includes("/checkout/cart");
  const isShippingStep = currentPath.includes("/checkout/shipping");
  const isReviewStep = currentPath.includes("/checkout/payment");
  const previousStep = isShippingStep
    ? "/checkout/cart"
    : isReviewStep
      ? "/checkout/shipping"
      : null;
  const canProceed =
    hasItems &&
    (isCartStep || Boolean(checkout?.can_finalize)) &&
    !checkoutError &&
    !checkoutSelectionIsPending &&
    !confirmOrder.isPending;

  const handleContinue = () => {
    if (isCartStep) {
      if (authStatus !== "authenticated") {
        router.push("/auth/login?next=%2Fcheckout%2Fshipping");
        return;
      }
      router.push("/checkout/shipping");
      return;
    }
    if (isShippingStep) {
      if (!checkout?.can_finalize) {
        toast.error("آدرس و روش ارسال را کامل کنید");
        return;
      }
      router.push("/checkout/payment");
      return;
    }
    if (isReviewStep) {
      confirmOrder.mutate();
    }
  };

  const buttonLabel = checkoutSelectionIsPending
    ? "در حال به‌روزرسانی سفارش..."
    : isReviewStep
      ? confirmOrder.isPending
        ? "در حال ثبت سفارش..."
        : "ثبت نهایی سفارش"
      : isCartStep && authStatus !== "authenticated"
        ? "ورود و ادامه خرید"
        : "ادامه فرایند خرید";

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h3 className="text-lg font-semibold">خلاصه سفارش</h3>
        <div className="space-y-2 text-sm">
          <PriceRow
            label="تعداد کالا"
            value={`${totalItems.toLocaleString("fa-IR")} عدد`}
          />
          <PriceRow
            label="جمع کالاها"
            value={`${itemsTotal.toLocaleString("fa-IR")} تومان`}
          />
          {checkout && checkout.summary.discount > 0 && (
            <PriceRow
              label="تخفیف کالاها"
              value={`− ${checkout.summary.discount.toLocaleString("fa-IR")} تومان`}
              className="text-green-700"
            />
          )}
          {checkout && (
            <PriceRow
              label="هزینه ارسال"
              value={
                checkout.shipping_rate_id
                  ? checkout.summary.shipping === 0
                    ? "رایگان"
                    : `${checkout.summary.shipping.toLocaleString("fa-IR")} تومان`
                  : checkout.address_id &&
                      !checkout.shipping_selection_required &&
                      !checkout.shipping_unavailable
                    ? "با هماهنگی فروشگاه"
                    : "پس از انتخاب"
              }
            />
          )}
          <hr />
          <PriceRow
            label="مبلغ نهایی"
            value={`${finalTotal.toLocaleString("fa-IR")} تومان`}
            className="text-base font-semibold"
          />
        </div>

        {checkoutError && (
          <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
            دریافت خلاصه معتبر سفارش ناموفق بود.
          </p>
        )}
        {!isCartStep && checkout?.issues.length ? (
          <ul className="space-y-1 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
            {checkout.issues.map((issue) => (
              <li key={issue}>• {issue}</li>
            ))}
          </ul>
        ) : null}

        <Button
          className="bg-brand-primary hover:bg-brand-primary-focus w-full"
          size="lg"
          disabled={!canProceed}
          onClick={handleContinue}
        >
          {checkoutSelectionIsPending && (
            <SpinnerLoading className="size-4 fill-white text-white/30" />
          )}
          {buttonLabel}
        </Button>

        {previousStep && (
          <Button
            className="border-brand-primary w-full border-2"
            variant="outline"
            size="lg"
            onClick={() => router.push(previousStep)}
          >
            بازگشت به مرحله قبل
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function PriceRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex justify-between gap-3 ${className ?? ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
