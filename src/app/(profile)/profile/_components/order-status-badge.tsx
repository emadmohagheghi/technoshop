import { Badge } from "@/app/_components/ui/badge";
import { DeliveryStatus, PaymentStatus } from "@/types/order.types";
import { getOrderStatusLabel } from "@/utils/profile";
import { cn } from "@/lib/utils";

export default function OrderStatusBadge({
  paymentStatus,
  deliveryStatus,
}: {
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
}) {
  const label = getOrderStatusLabel(paymentStatus, deliveryStatus);
  return (
    <Badge
      variant="outline"
      className={cn("border-0 px-2.5 py-1", {
        "bg-warning-content text-warning-focus": label === "در انتظار پرداخت",
        "bg-tint-50 text-brand-primary":
          label === "در انتظار تایید" || label === "درحال پردازش",
        "bg-blue-50 text-blue-700": label === "ارسال شده",
        "bg-success-content text-green-700": label === "تحویل داده شده",
        "bg-red-50 text-red-700": label === "لغو شده",
      })}
    >
      {label}
    </Badge>
  );
}
