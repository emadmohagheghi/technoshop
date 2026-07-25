import { Button } from "@/app/_components/ui/button";
import { OrderSummary } from "@/types/order.types";
import { imageUrl } from "@/utils/product";
import { formatProfileDate, formatProfilePrice } from "@/utils/profile";
import { ArrowLeft2, Bag2 } from "iconsax-reactjs";
import Image from "next/image";
import Link from "next/link";
import OrderStatusBadge from "./order-status-badge";

export default function OrderCard({ order }: { order: OrderSummary }) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-gray-900">سفارش #{order.slug}</h2>
            <OrderStatusBadge
              paymentStatus={order.payment_status}
              deliveryStatus={order.delivery_status}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {formatProfileDate(order.ordered_at)}
          </p>
        </div>
        <div className="text-left">
          <p className="text-xs text-gray-500">مبلغ سفارش</p>
          <p className="mt-1 font-bold text-gray-900">
            {formatProfilePrice(order.final_paid_price || order.payment_price)}{" "}
            تومان
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {order.product_images.length > 0 ? (
            order.product_images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative size-12 overflow-hidden rounded-lg border bg-white"
              >
                <Image
                  src={imageUrl(image)}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-contain p-1"
                />
              </div>
            ))
          ) : (
            <div className="grid size-12 place-items-center rounded-lg bg-gray-100">
              <Bag2 size={22} className="text-gray-500" />
            </div>
          )}
          <span className="mr-1 text-sm text-gray-600">
            {order.item_count.toLocaleString("fa-IR")} کالا
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/profile/orders/${order.slug}`}>
              مشاهده جزئیات
              <ArrowLeft2 size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
