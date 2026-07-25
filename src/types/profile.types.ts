import type { OrderCounts, OrderSummary } from "@/types/order.types";
import type { Product } from "@/types/product.types";

export type ProfileDashboardData = {
  orders: {
    counts: OrderCounts;
    latest_order: OrderSummary | null;
  };
  favorite_products: Product[];
  recent_products: Product[];
};
