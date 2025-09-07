import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductDetail } from "@/types/product.types";

export type CartItem = {
  short_slug: number;
  quantity: number;
};

interface CartStore {
  cart: CartItem[];

  // Actions
  addOne: (product: Pick<ProductDetail, "short_slug">) => void;
  removeOne: (product: Pick<ProductDetail, "short_slug">) => void;
  removeAllOfProduct: (product: Pick<ProductDetail, "short_slug">) => void;
  clearCart: () => void;

  // Getters
  getQuantity: (product: Pick<ProductDetail, "short_slug">) => number;
  getTotalItems: () => number;
  isInCart: (product: Pick<ProductDetail, "short_slug">) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addOne: ({ short_slug }) => {
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) => item.short_slug === short_slug,
          );

          if (existingIndex > -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingIndex].quantity += 1;
            return { cart: updatedCart };
          } else {
            return { cart: [...state.cart, { short_slug, quantity: 1 }] };
          }
        });
      },

      removeOne: ({ short_slug }) => {
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) => item.short_slug === short_slug,
          );

          if (existingIndex > -1) {
            const updatedCart = [...state.cart];
            if (updatedCart[existingIndex].quantity > 1) {
              updatedCart[existingIndex].quantity -= 1;
              return { cart: updatedCart };
            } else {
              // حذف کامل محصول اگر quantity به ۰ برسد
              return {
                cart: updatedCart.filter((_, i) => i !== existingIndex),
              };
            }
          }
          return state;
        });
      },

      removeAllOfProduct: ({ short_slug }) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.short_slug !== short_slug),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getQuantity: ({ short_slug }) => {
        const item = get().cart.find((item) => item.short_slug === short_slug);
        return item ? item.quantity : 0;
      },

      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      isInCart: ({ short_slug }) => {
        return get().cart.some((item) => item.short_slug === short_slug);
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cart: state.cart }),
      skipHydration: true,
    },
  ),
);
