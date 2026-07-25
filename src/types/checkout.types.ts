import type { ShippingRate } from "@/types/order.types";

export type CheckoutShippingRate = ShippingRate & {
  calculated_price: number;
};

export type CheckoutSummary = {
  items_total: number;
  items_before_discount: number;
  discount: number;
  shipping: number;
  payable: number;
};

export type CheckoutState = {
  order_id: number | null;
  item_count: number;
  address_id: number | null;
  shipping_rate_id: number | null;
  shipping_rates: CheckoutShippingRate[];
  shipping_selection_required: boolean;
  shipping_unavailable: boolean;
  summary: CheckoutSummary;
  can_finalize: boolean;
  issues: string[];
};

export type CheckoutSelection = {
  address_id?: number;
  shipping_rate_id?: number;
};

export type CheckoutConfirmation = {
  order_slug: string;
  redirect_to: string;
};
