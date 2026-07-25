export type PaymentStatus =
  | "باز"
  | "در انتظار پرداخت"
  | "پرداخت شده"
  | "ثبت شده";
export type DeliveryStatus =
  | "لغو شده"
  | "در انتظار تایید"
  | "درحال پردازش"
  | "ارسال شده"
  | "تحویل داده شده"
  | null;

export type OrderSummary = {
  id: number;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  slug: string;
  final_paid_price: number;
  payment_price: number;
  ordered_at: string | null;
  delivery_status_modified_at: string | null;
  repayment_expire_at: string | null;
  item_count: number;
  product_images: string[];
};

export type OrderCounts = {
  all: number;
  pending_payment: number;
  current: number;
  delivered: number;
  canceled: number;
};

export type OrdersProfileData = {
  all_orders: OrderSummary[];
  pending_payment_orders: OrderSummary[];
  current_orders: OrderSummary[];
  delivered_orders: OrderSummary[];
  canceled_orders: OrderSummary[];
  counts: OrderCounts;
};

export type OrderProduct = {
  id: number;
  short_slug: number;
  title_ir: string;
  image: string;
  url: string;
  attribute_values: Record<string, unknown> | null;
};

export type OrderItemDetail = {
  id: number;
  product: OrderProduct;
  count: number;
  total_price: number;
  total_profit: number;
  final_price: number | null;
  final_price_before_discount: number | null;
  final_discount: number | null;
  final_profit: number | null;
};

export type OrderAddress = {
  receiver_name: string;
  receiver_family: string;
  receiver_phone: string;
  receiver_city: string;
  receiver_province: string;
  receiver_postal_code: string;
  receiver_address: string;
  receiver_building_number: string | null;
  receiver_unit: string | null;
  receiver_national_code: string;
};

export type ShippingRate = {
  id: number;
  service: {
    id: number;
    name: string;
    image: string | null;
    url: string | null;
  };
  area: string | null;
  price: number;
  all_area: boolean;
  free_shipping_threshold: number | null;
  pay_at_destination: boolean;
};

export type OrderDetail = OrderSummary & {
  items: OrderItemDetail[];
  shipping_rate: ShippingRate | null;
  address: OrderAddress | null;
  tracking_code: string | null;
  payment_price: number;
  total_items_before_discount_price: number;
  total_profit_price: number;
  final_profit_price: number;
  final_total_items_final_price: number;
  final_total_items_before_discount_price: number;
  final_coupon_effect_price: number;
  final_shipping_effect_price: number;
};
