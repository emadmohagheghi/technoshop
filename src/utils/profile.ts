import { DeliveryStatus, PaymentStatus } from "@/types/order.types";

export function formatProfilePrice(value: number | null | undefined) {
  return new Intl.NumberFormat("fa-IR").format(value ?? 0);
}

export function formatProfileDate(value: string | null | undefined) {
  if (!value) return "ثبت نشده";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function getOrderStatusLabel(
  paymentStatus: PaymentStatus,
  deliveryStatus: DeliveryStatus,
) {
  if (paymentStatus === "در انتظار پرداخت") return "در انتظار پرداخت";
  return deliveryStatus ?? paymentStatus;
}
