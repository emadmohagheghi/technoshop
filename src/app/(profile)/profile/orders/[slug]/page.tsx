"use client";

import { Button } from "@/app/_components/ui/button";
import { getProfileOrder } from "@/services/orders-service";
import { useCartStore } from "@/stores/cart.store";
import { imageUrl } from "@/utils/product";
import { formatProfileDate, formatProfilePrice } from "@/utils/profile";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowRight2,
  Box,
  Location,
  ShoppingCart,
  TruckFast,
} from "iconsax-reactjs";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import OrderStatusBadge from "../../_components/order-status-badge";
import { ProfileError, ProfileLoading } from "../../_components/profile-states";

const deliverySteps = [
  "در انتظار تایید",
  "درحال پردازش",
  "ارسال شده",
  "تحویل داده شده",
];

export default function OrderDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const setQuantity = useCartStore((state) => state.setQuantity);
  const getQuantity = useCartStore((state) => state.getQuantity);
  const orderQuery = useQuery({
    queryKey: ["profile", "orders", params.slug],
    queryFn: () => getProfileOrder(params.slug),
    enabled: Boolean(params.slug),
  });
  const reorder = useMutation({
    mutationFn: async () => {
      if (!orderQuery.data) return;
      for (const item of orderQuery.data.items) {
        const currentQuantity = getQuantity(item.product.short_slug);
        const updated = await setQuantity(
          item.product.short_slug,
          currentQuantity + item.count,
        );
        if (!updated) {
          throw new Error("cart_update_failed");
        }
      }
    },
    onSuccess: () => {
      toast.success("کالاهای سفارش به سبد خرید اضافه شدند");
      router.push("/checkout/cart");
    },
    onError: () => toast.error("افزودن دوباره کالاها به سبد ناموفق بود"),
  });

  if (orderQuery.isLoading) return <ProfileLoading cards={3} />;
  if (orderQuery.isError || !orderQuery.data) {
    return <ProfileError onRetry={() => void orderQuery.refetch()} />;
  }

  const order = orderQuery.data;
  const activeStep = deliverySteps.indexOf(order.delivery_status ?? "");
  return (
    <div className="space-y-5">
      <section className="rounded-xl border bg-white p-4 sm:p-6">
        <Button
          variant="ghost"
          className="-mr-3 mb-3"
          onClick={() => router.back()}
        >
          <ArrowRight2 size={18} />
          بازگشت به سفارش‌ها
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">
                سفارش #{order.slug}
              </h1>
              <OrderStatusBadge
                paymentStatus={order.payment_status}
                deliveryStatus={order.delivery_status}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              ثبت سفارش: {formatProfileDate(order.ordered_at)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={reorder.isPending}
              onClick={() => reorder.mutate()}
            >
              <ShoppingCart size={18} />
              {reorder.isPending ? "در حال افزودن..." : "خرید دوباره"}
            </Button>
          </div>
        </div>
      </section>

      {["پرداخت شده", "ثبت شده"].includes(order.payment_status) &&
        order.delivery_status !== "لغو شده" && (
          <section className="rounded-xl border bg-white p-5">
            <div className="grid grid-cols-4 gap-2">
              {deliverySteps.map((step, index) => {
                const completed = index <= activeStep;
                return (
                  <div key={step} className="relative text-center">
                    {index > 0 && (
                      <div
                        className={`absolute top-3.5 right-[-50%] h-0.5 w-full ${
                          completed ? "bg-brand-primary" : "bg-gray-200"
                        }`}
                      />
                    )}
                    <div
                      className={`relative z-10 mx-auto grid size-7 place-items-center rounded-full text-xs ${
                        completed
                          ? "bg-brand-primary text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <p className="mt-2 text-[10px] text-gray-600 sm:text-xs">
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      <section className="rounded-xl border bg-white p-4 sm:p-6">
        <h2 className="font-bold text-gray-900">کالاهای سفارش</h2>
        <div className="mt-4 divide-y">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 py-4 first:pt-0 sm:flex-row sm:items-center"
            >
              <Link
                href={item.product.url}
                className="relative size-24 shrink-0 overflow-hidden rounded-lg border"
              >
                <Image
                  src={imageUrl(item.product.image)}
                  alt={item.product.title_ir}
                  fill
                  sizes="96px"
                  className="object-contain p-2"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={item.product.url}
                  className="hover:text-brand-primary font-medium text-gray-900"
                >
                  {item.product.title_ir}
                </Link>
                <p className="mt-2 text-sm text-gray-500">
                  تعداد: {item.count.toLocaleString("fa-IR")}
                </p>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">
                  {formatProfilePrice(item.final_price ?? item.total_price)}{" "}
                  تومان
                </p>
                {(item.final_profit ?? item.total_profit) > 0 && (
                  <p className="mt-1 text-xs text-green-700">
                    {formatProfilePrice(item.final_profit ?? item.total_profit)}{" "}
                    تومان سود شما
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-xl border bg-white p-5">
          <div className="flex items-center gap-2">
            <Location size={22} className="text-brand-primary" />
            <h2 className="font-bold text-gray-900">نشانی تحویل</h2>
          </div>
          {order.address ? (
            <div className="mt-4 space-y-2 text-sm leading-6 text-gray-700">
              <p className="font-medium">
                {order.address.receiver_name} {order.address.receiver_family}
              </p>
              <p>
                {order.address.receiver_province}، {order.address.receiver_city}
                ، {order.address.receiver_address}
              </p>
              <p>
                پلاک {order.address.receiver_building_number || "—"}، واحد{" "}
                {order.address.receiver_unit || "—"}
              </p>
              <p>کد پستی: {order.address.receiver_postal_code}</p>
              <p>موبایل: {order.address.receiver_phone}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">نشانی ثبت نشده است.</p>
          )}
        </section>

        <section className="rounded-xl border bg-white p-5">
          <div className="flex items-center gap-2">
            <TruckFast size={22} className="text-brand-primary" />
            <h2 className="font-bold text-gray-900">ارسال سفارش</h2>
          </div>
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p>{order.shipping_rate?.service.name || "روش ارسال ثبت نشده"}</p>
            {order.tracking_code && <p>کد رهگیری: {order.tracking_code}</p>}
            <p>
              هزینه ارسال:{" "}
              {formatProfilePrice(
                order.final_shipping_effect_price ||
                  order.shipping_rate?.price ||
                  0,
              )}{" "}
              تومان
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-xl border bg-white p-5">
        <div className="flex items-center gap-2">
          <Box size={22} className="text-brand-primary" />
          <h2 className="font-bold text-gray-900">خلاصه سفارش</h2>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <PriceRow
            label="جمع قیمت کالاها"
            value={
              order.final_total_items_before_discount_price ||
              order.total_items_before_discount_price
            }
          />
          <PriceRow
            label="تخفیف کالاها"
            value={order.final_profit_price || order.total_profit_price}
            positive
          />
          <PriceRow
            label="تخفیف کد تخفیف"
            value={order.final_coupon_effect_price}
            positive
          />
          <PriceRow
            label="هزینه ارسال"
            value={order.final_shipping_effect_price}
          />
          <div className="flex items-center justify-between border-t pt-4 text-base font-bold">
            <span>مبلغ نهایی سفارش</span>
            <span>
              {formatProfilePrice(
                order.final_paid_price || order.payment_price,
              )}{" "}
              تومان
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

function PriceRow({
  label,
  value,
  positive,
}: {
  label: string;
  value: number;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-gray-700">
      <span>{label}</span>
      <span className={positive ? "text-green-700" : undefined}>
        {positive && value > 0 ? "− " : ""}
        {formatProfilePrice(value)} تومان
      </span>
    </div>
  );
}
