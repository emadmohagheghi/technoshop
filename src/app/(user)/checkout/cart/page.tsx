"use client";
import { useCartStore } from "@/stores/cart.store";
import { useQueries } from "@tanstack/react-query";
import { getProductByShortSlug } from "@/services/products-service";
import OrderedProducts from "./_components/ordered-products";

export default function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const cartStatus = useCartStore((state) => state.status);
  const setQuantity = useCartStore((state) => state.setQuantity);

  // استفاده از useQueries برای دریافت همزمان اطلاعات تمام محصولات
  const productQueries = useQueries({
    queries: cart.map((cartItem) => ({
      queryKey: ["products", cartItem.short_slug],
      queryFn: () => getProductByShortSlug(cartItem.short_slug),
      enabled: true,
    })),
  });

  const isLoading =
    cartStatus !== "ready" || productQueries.some((query) => query.isLoading);
  const products = productQueries
    .map((query) => query.data)
    .filter((product) => product !== undefined);

  if (cart.length === 0 && !isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-semibold text-gray-700">
            سبد خرید شما خالی است
          </h2>
          <p className="text-gray-500">محصولی به سبد خرید اضافه نکرده‌اید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="sr-only">سبد خرید</h1>

      <div className="">
        <div className="">
          <OrderedProducts
            cart={cart}
            products={products}
            isLoading={isLoading}
            onUpdateQuantity={(short_slug, quantity) =>
              void setQuantity(short_slug, quantity)
            }
            onRemoveProduct={(short_slug) => void setQuantity(short_slug, 0)}
          />
        </div>
      </div>
    </div>
  );
}
