import { useState, useEffect, useCallback } from "react";
import { ProductDetail } from "@/types/product.types";

export type CartItem = {
  short_slug: number;
  quantity: number;
};

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {
        console.error("Invalid cart data in localStorage");
        localStorage.removeItem("cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addOne = useCallback(({ short_slug }: Pick<ProductDetail , "short_slug">) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.short_slug === short_slug,
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { short_slug, quantity: 1 }];
      }
    });
  }, []);

  const removeOne = useCallback(({ short_slug }: Pick<ProductDetail , "short_slug">) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.short_slug === short_slug,
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        if (updated[existingIndex].quantity > 1) {
          updated[existingIndex].quantity -= 1;
          return updated;
        } else {
          // حذف کامل محصول اگر quantity به ۰ برسد
          return updated.filter((_, i) => i !== existingIndex);
        }
      }
      return prev;
    });
  }, []);

  const removeAllOfProduct = useCallback(({ short_slug }: Pick<ProductDetail , "short_slug">) => {
    setCart((prev) => prev.filter((item) => item.short_slug !== short_slug));
  }, []);

  const getQuantity = useCallback(
    ({ short_slug }: Pick<ProductDetail , "short_slug">) => {
      const item = cart.find((item) => item.short_slug === short_slug);
      return item ? item.quantity : 0;
    },
    [cart],
  );

  return {
    cart,
    addOne,
    removeOne,
    removeAllOfProduct,
    getQuantity,
  };
}
