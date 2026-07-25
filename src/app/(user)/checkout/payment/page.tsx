"use client";

import AddressCard from "@/app/_components/address/address-card";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { getAddresses } from "@/services/addresses-service";
import { getCheckout } from "@/services/checkout-service";
import { useQuery } from "@tanstack/react-query";
import { ClipboardTick, ShieldTick, Truck } from "iconsax-reactjs";
import Link from "next/link";

export default function ReviewOrderPage() {
  const checkoutQuery = useQuery({
    queryKey: ["checkout"],
    queryFn: getCheckout,
  });
  const addressesQuery = useQuery({
    queryKey: ["profile", "addresses"],
    queryFn: getAddresses,
  });

  if (checkoutQuery.isLoading || addressesQuery.isLoading) {
    return <div className="h-80 animate-pulse rounded-xl bg-gray-100" />;
  }

  const checkout = checkoutQuery.data;
  const address = addressesQuery.data?.find(
    (item) => item.id === checkout?.address_id,
  );
  const shipping = checkout?.shipping_rates.find(
    (item) => item.id === checkout.shipping_rate_id,
  );

  const shippingIsComplete =
    checkout &&
    !checkout.shipping_unavailable &&
    (!checkout.shipping_selection_required || Boolean(shipping));

  if (!checkout || !address || !shippingIsComplete || !checkout.can_finalize) {
    return (
      <Card>
        <CardContent className="space-y-4 p-8 text-center">
          <ClipboardTick className="mx-auto text-amber-500" size={40} />
          <div>
            <h2 className="font-semibold">اطلاعات ارسال کامل نیست</h2>
            <p className="mt-1 text-sm text-gray-500">
              آدرس و روش ارسال را بررسی کنید و دوباره ادامه دهید.
            </p>
          </div>
          <Button asChild className="bg-brand-primary">
            <Link href="/checkout/shipping">بازگشت به مرحله ارسال</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>مرور نهایی سفارش</CardTitle>
          <p className="text-sm text-gray-500">
            پیش از ثبت سفارش، اطلاعات تحویل را یک بار بررسی کنید.
          </p>
        </CardHeader>
        <CardContent>
          <AddressCard address={address} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>روش ارسال</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-xl border p-4">
            <Truck className="text-brand-primary" size={26} />
            <div className="flex-1">
              <p className="font-semibold">
                {shipping?.service.name ?? "ارسال با هماهنگی فروشگاه"}
              </p>
              {shipping ? (
                <p className="mt-1 text-sm text-gray-500">
                  {shipping.pay_at_destination
                    ? "هزینه ارسال هنگام تحویل دریافت می‌شود"
                    : shipping.calculated_price === 0
                      ? "ارسال رایگان"
                      : `${shipping.calculated_price.toLocaleString("fa-IR")} تومان`}
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  جزئیات ارسال پس از ثبت سفارش با شما هماهنگ می‌شود.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        <ShieldTick className="shrink-0" size={24} />
        <p>
          این پروژه به درگاه پرداخت متصل نیست. با ثبت نهایی، سفارش مستقیماً در
          سیستم ثبت و برای پردازش آماده می‌شود.
        </p>
      </div>
    </div>
  );
}
