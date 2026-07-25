"use client";

import { getCheckout } from "@/services/checkout-service";
import { getProductByShortSlug } from "@/services/products-service";
import { useCartStore } from "@/stores/cart.store";
import { useUserStore } from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";
import OrderSummary from "./order-summery";

export default function OrderSummaryWrapper() {
  const cart = useCartStore((state) => state.cart);
  const cartStatus = useCartStore((state) => state.status);
  const authStatus = useUserStore((state) => state.status);
  const cartItemSlugs = cart.map((item) => item.short_slug);
  const checkoutQuery = useQuery({
    queryKey: ["checkout"],
    queryFn: getCheckout,
    enabled: authStatus === "authenticated" && cartStatus === "ready",
  });
  const productsQuery = useQuery({
    queryKey: ["cart-products", cartItemSlugs],
    queryFn: async () =>
      Promise.all(cartItemSlugs.map((slug) => getProductByShortSlug(slug))),
    enabled:
      authStatus === "unauthenticated" &&
      cartStatus === "ready" &&
      cartItemSlugs.length > 0,
  });

  const isLoading =
    cartStatus !== "ready" ||
    authStatus === "loading" ||
    (authStatus === "authenticated" && checkoutQuery.isLoading) ||
    (authStatus === "unauthenticated" && productsQuery.isLoading);

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-lg bg-gray-100 p-6">
        <div className="mb-4 h-6 rounded bg-gray-200" />
        <div className="space-y-3">
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-10 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <OrderSummary
      cart={cart}
      products={productsQuery.data ?? []}
      checkout={checkoutQuery.data}
      checkoutError={checkoutQuery.isError}
      authStatus={authStatus}
    />
  );
}
