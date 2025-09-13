"use client";
import { CartItem } from "@/stores/cart.store";
import { ProductDetail } from "@/types/product.types";
import OrderedProductCard from "./ordered-product-card";

interface OrderedProductsProps {
  cart: CartItem[];
  products: ProductDetail[];
  isLoading: boolean;
  onUpdateQuantity: (short_slug: number, newQuantity: number) => void;
  onRemoveProduct: (short_slug: number) => void;
}

export default function OrderedProducts({
  cart,
  products,
  isLoading,
  onUpdateQuantity,
  onRemoveProduct,
}: OrderedProductsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">محصولات سفارش</h2>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse items-center gap-4 rounded-2xl border bg-gradient-to-br from-gray-50 to-gray-100 p-4"
          >
            <div className="h-24 w-24 rounded-xl bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-3 w-1/2 rounded bg-gray-200"></div>
              <div className="h-4 w-1/4 rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.map((cartItem) => {
        const product = products.find(
          (p) => p.short_slug === cartItem.short_slug,
        );

        if (!product) {
          return (
            <div
              key={cartItem.short_slug}
              className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 p-4"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-red-200">
                <span className="text-sm text-red-500">خطا</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-600">محصول یافت نشد</p>
                <button
                  onClick={() => onRemoveProduct(cartItem.short_slug)}
                  className="mt-2 text-sm text-red-500 underline"
                >
                  حذف از سبد خرید
                </button>
              </div>
            </div>
          );
        }

        return (
          <OrderedProductCard
            key={cartItem.short_slug}
            product={product}
            quantity={cartItem.quantity}
            onUpdateQuantity={(newQuantity) =>
              onUpdateQuantity(cartItem.short_slug, newQuantity)
            }
            onRemove={() => onRemoveProduct(cartItem.short_slug)}
          />
        );
      })}
    </div>
  );
}
