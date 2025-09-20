"use client";

import { useCartStore } from "@/stores/cart.store";
import { useQuery } from "@tanstack/react-query";
import { getProductByShortSlug } from "@/services/products-service";
import OrderSummary from "./order-summery";

export default function OrderSummaryWrapper() {
  const cart = useCartStore((state) => state.cart);

  // Extract short_slugs from cart items for fetching products
  const cartItemSlugs = cart.map((item) => item.short_slug);

  // Fetch all products for items in cart
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["cart-products", cartItemSlugs],
    queryFn: async () => {
      if (cartItemSlugs.length === 0) return [];

      const productPromises = cartItemSlugs.map((slug) =>
        getProductByShortSlug(slug),
      );
      const products = await Promise.all(productPromises);
      return products;
    },
    enabled: cartItemSlugs.length > 0,
  });

  if (isLoading && cartItemSlugs.length > 0) {
    return (
      <div className="lg:col-span-1">
        <div className="animate-pulse rounded-lg bg-gray-200 p-6">
          <div className="mb-4 h-6 animate-pulse rounded bg-gray-300"></div>
          <div className="space-y-3">
            <div className="h-4 animate-pulse rounded bg-gray-300"></div>
            <div className="h-4 animate-pulse rounded bg-gray-300"></div>
            <div className="h-4 animate-pulse rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    );
  }

  return <OrderSummary cart={cart} products={products} />;
}
