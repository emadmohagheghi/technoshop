"use client";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { CartItem } from "@/stores/cart.store";
import { ProductDetail } from "@/types/product.types";
import { useRouter, usePathname } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { ShippingAddressForm } from "@/app/checkout/shipping/_types/shipping-info.schema";
import { toast } from "sonner";

interface OrderSummaryProps {
  cart: CartItem[];
  products: ProductDetail[];
}

export default function OrderSummary({ cart, products }: OrderSummaryProps) {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cart.reduce((total, cartItem) => {
    const product = products.find((p) => p.short_slug === cartItem.short_slug);
    if (product) {
      const hasSpecialPrice =
        product.stockrecord.special_sale_price &&
        product.stockrecord.special_sale_price < product.stockrecord.sale_price;

      const finalPrice = hasSpecialPrice
        ? product.stockrecord.special_sale_price
        : product.stockrecord.sale_price;

      return total + finalPrice * cartItem.quantity;
    }
    return total;
  }, 0);

  const finalTotal = totalPrice;

  const router = useRouter();
  const currentPath = usePathname();

  let formMethods = null;
  try {
    formMethods = useFormContext<ShippingAddressForm>();
  } catch (error) {
  }

  const isShippingInfoComplete = () => {
    if (!formMethods) return false;

    const values = formMethods.getValues();
    const requiredFields = [
      "fullName",
      "phone",
      "city",
      "postalCode",
      "address",
    ];
    const allFilled = requiredFields.every((field) => {
      const value = values[field as keyof ShippingAddressForm];
      return value && value.toString().trim().length > 0;
    });
    const noErrors = Object.keys(formMethods.formState.errors).length === 0;
    return allFilled && noErrors;
  };

  const canProceedToNext = () => {
    if (cart.length === 0) return false;

    if (currentPath.includes("/checkout/shipping")) {
      return isShippingInfoComplete();
    }

    return true;
  };

  const getNextStep = () => {
    if (currentPath.includes("/checkout/cart")) {
      return "/checkout/shipping";
    } else if (currentPath.includes("/checkout/shipping")) {
      return "/checkout/payment";
    } else if (currentPath.includes("/checkout/payment")) {
      toast.success("پرداخت با موفقیت انجام شد!");
      return "/";
    }

    return "/checkout/cart";
  };

  const getPrevStep = () => {
    if (currentPath.includes("/checkout/shipping")) {
      return "/checkout/cart";
    } else if (currentPath.includes("/checkout/payment")) {
      return "/checkout/shipping";
    }
    return null;
  };

  const doseHavePrevStep = !!getPrevStep();

  const handlePrevStep = () => {
    const prevStep = getPrevStep();
    if (prevStep) {
      router.push(prevStep);
    }
  };

  const handleContinueToNext = () => {
    if (
      currentPath.includes("/checkout/shipping") &&
      !isShippingInfoComplete()
    ) {
      toast.error("لطفا تمام اطلاعات ارسال را کامل کنید");
      return;
    }

    const nextStep = getNextStep();
    router.push(nextStep);
  };

  return (
    <Card className="">
      <CardContent className="space-y-4 p-6">
        <h3 className="text-lg font-semibold">خلاصه سفارش</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>تعداد کالا:</span>
            <span>{totalItems} عدد</span>
          </div>
          <div className="flex justify-between">
            <span>جمع کل:</span>
            <span>{totalPrice.toLocaleString()} تومان</span>
          </div>

          <hr />
          <div className="flex justify-between text-lg font-semibold">
            <span>مجموع نهایی:</span>
            <span>{finalTotal.toLocaleString()} تومان</span>
          </div>
        </div>

        <Button
          className="bg-brand-primary hover:bg-brand-primary-focus w-full"
          size="lg"
          disabled={!canProceedToNext()}
          onClick={handleContinueToNext}
        >
          ادامه فرآیند خرید
        </Button>

        {currentPath.includes("/checkout/shipping") &&
          !isShippingInfoComplete() && (
            <p className="text-center text-sm text-red-500">
              برای ادامه، لطفا تمام اطلاعات ارسال را کامل کنید
            </p>
          )}
        {doseHavePrevStep && (
          <Button
            className="border-brand-primary w-full border-2"
            variant="outline"
            size="lg"
            onClick={handlePrevStep}
          >
            بازگشت به مرحله قبل
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
