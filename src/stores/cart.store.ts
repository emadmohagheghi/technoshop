import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  clearServerCart,
  getCart,
  mergeGuestCart,
  ServerCart,
  setServerCartQuantity,
} from "@/services/cart-service";
import { publishServerCartChanged } from "@/lib/cart-sync";

export type CartItem = {
  short_slug: number;
  quantity: number;
};

type CartSource = "uninitialized" | "guest" | "server";
type CartStatus = "idle" | "loading" | "ready" | "error";

interface CartStore {
  cart: CartItem[];
  guestCart: CartItem[];
  source: CartSource;
  status: CartStatus;
  error: string | null;
  pendingSlugs: number[];
  isClearing: boolean;

  initialize: (isAuthenticated: boolean) => Promise<boolean>;
  refresh: (notifyOtherTabs?: boolean) => Promise<boolean>;
  setQuantity: (short_slug: number, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  syncGuestCart: (cart: CartItem[]) => void;

  getQuantity: (short_slug: number) => number;
  getTotalItems: () => number;
  isPending: (short_slug: number) => boolean;
}

let initializationId = 0;
let mutationQueue: Promise<void> = Promise.resolve();

const enqueueMutation = <T>(operation: () => Promise<T>): Promise<T> => {
  const result = mutationQueue.then(operation, operation);
  mutationQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
};

const cartItems = (cart: ServerCart): CartItem[] =>
  cart.items.filter(
    (item) =>
      Number.isInteger(item.short_slug) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0,
  );

const setLocalQuantity = (
  cart: CartItem[],
  short_slug: number,
  quantity: number,
): CartItem[] => {
  const withoutProduct = cart.filter((item) => item.short_slug !== short_slug);
  return quantity > 0
    ? [...withoutProduct, { short_slug, quantity }]
    : withoutProduct;
};

const removePendingSlug = (pendingSlugs: number[], short_slug: number) =>
  pendingSlugs.filter((slug) => slug !== short_slug);

const normalizeGuestCart = (cart: CartItem[]): CartItem[] => {
  const quantities = new Map<number, number>();

  for (const item of cart) {
    if (
      !Number.isInteger(item.short_slug) ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      continue;
    }

    quantities.set(item.short_slug, Math.min(100, item.quantity));
  }

  return Array.from(quantities, ([short_slug, quantity]) => ({
    short_slug,
    quantity,
  }));
};

const cartsAreEqual = (first: CartItem[], second: CartItem[]) =>
  first.length === second.length &&
  first.every(
    (item, index) =>
      item.short_slug === second[index]?.short_slug &&
      item.quantity === second[index]?.quantity,
  );

const hydrateGuestCart = async () => {
  if (!useCartStore.persist.hasHydrated()) {
    await useCartStore.persist.rehydrate();
  }
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      guestCart: [],
      source: "uninitialized",
      status: "idle",
      error: null,
      pendingSlugs: [],
      isClearing: false,

      initialize: async (isAuthenticated) => {
        const currentInitialization = ++initializationId;
        await hydrateGuestCart();

        if (currentInitialization !== initializationId) return false;

        set({ status: "loading", error: null });

        if (!isAuthenticated) {
          const guestCart = get().guestCart;
          set({
            cart: guestCart,
            source: "guest",
            status: "ready",
            error: null,
            pendingSlugs: [],
            isClearing: false,
          });
          return true;
        }

        try {
          const guestCart = get().guestCart;
          const response = guestCart.length
            ? await mergeGuestCart(guestCart)
            : await getCart();

          if (currentInitialization !== initializationId) return false;
          set({
            cart: cartItems(response.data),
            guestCart: [],
            source: "server",
            status: "ready",
            error: null,
            pendingSlugs: [],
            isClearing: false,
          });
          if (guestCart.length > 0) publishServerCartChanged();
          return true;
        } catch {
          if (currentInitialization === initializationId) {
            set({
              cart: [],
              source: "server",
              status: "error",
              error: "cart_initialization_failed",
              pendingSlugs: [],
              isClearing: false,
            });
          }
          return false;
        }
      },

      refresh: async (notifyOtherTabs = false) => {
        if (get().source !== "server") return false;
        try {
          const response = await getCart();
          set({
            cart: cartItems(response.data),
            status: "ready",
            error: null,
          });
          if (notifyOtherTabs) publishServerCartChanged();
          return true;
        } catch {
          set({ status: "error", error: "cart_refresh_failed" });
          return false;
        }
      },

      setQuantity: async (short_slug, requestedQuantity) => {
        if (!Number.isInteger(short_slug)) return false;
        const quantity = Math.min(
          100,
          Math.max(0, Math.trunc(requestedQuantity)),
        );

        if (get().source === "guest") {
          const guestCart = setLocalQuantity(
            get().guestCart,
            short_slug,
            quantity,
          );
          set({ cart: guestCart, guestCart, error: null });
          return true;
        }

        if (
          get().source !== "server" ||
          get().pendingSlugs.includes(short_slug) ||
          get().isClearing
        ) {
          return false;
        }

        const cartSession = initializationId;
        const previousQuantity = get().getQuantity(short_slug);
        set((state) => ({
          cart: setLocalQuantity(state.cart, short_slug, quantity),
          pendingSlugs: [...state.pendingSlugs, short_slug],
          error: null,
        }));

        return enqueueMutation(async () => {
          if (cartSession !== initializationId || get().source !== "server") {
            return false;
          }
          try {
            const response = await setServerCartQuantity({
              short_slug,
              quantity,
            });
            if (cartSession !== initializationId || get().source !== "server") {
              return false;
            }
            const confirmedQuantity =
              cartItems(response.data).find(
                (item) => item.short_slug === short_slug,
              )?.quantity ?? 0;
            set((state) => ({
              cart: setLocalQuantity(state.cart, short_slug, confirmedQuantity),
              pendingSlugs: removePendingSlug(state.pendingSlugs, short_slug),
              status: "ready",
              error: null,
            }));
            publishServerCartChanged();
            return true;
          } catch {
            if (cartSession !== initializationId || get().source !== "server") {
              return false;
            }
            try {
              const response = await getCart();
              if (
                cartSession !== initializationId ||
                get().source !== "server"
              ) {
                return false;
              }
              const serverQuantity =
                cartItems(response.data).find(
                  (item) => item.short_slug === short_slug,
                )?.quantity ?? 0;
              set((state) => ({
                cart: setLocalQuantity(state.cart, short_slug, serverQuantity),
                pendingSlugs: removePendingSlug(state.pendingSlugs, short_slug),
                status: "ready",
                error: "cart_update_failed",
              }));
            } catch {
              set((state) => ({
                cart: setLocalQuantity(
                  state.cart,
                  short_slug,
                  previousQuantity,
                ),
                pendingSlugs: removePendingSlug(state.pendingSlugs, short_slug),
                status: "error",
                error: "cart_update_failed",
              }));
            }
            return false;
          }
        });
      },

      clearCart: async () => {
        if (get().source === "guest") {
          set({ cart: [], guestCart: [], error: null });
          return true;
        }
        if (get().source !== "server" || get().isClearing) return false;

        const cartSession = initializationId;
        set({ isClearing: true, error: null });
        return enqueueMutation(async () => {
          if (cartSession !== initializationId || get().source !== "server") {
            return false;
          }
          try {
            const response = await clearServerCart();
            if (cartSession !== initializationId || get().source !== "server") {
              return false;
            }
            set({
              cart: cartItems(response.data),
              isClearing: false,
              pendingSlugs: [],
              status: "ready",
            });
            publishServerCartChanged();
            return true;
          } catch {
            set({
              isClearing: false,
              status: "error",
              error: "cart_clear_failed",
            });
            return false;
          }
        });
      },

      syncGuestCart: (cart) => {
        if (get().source !== "guest") return;

        const guestCart = normalizeGuestCart(cart);
        if (
          cartsAreEqual(get().cart, guestCart) &&
          cartsAreEqual(get().guestCart, guestCart)
        ) {
          return;
        }

        set({ cart: guestCart, guestCart, error: null });
      },

      getQuantity: (short_slug) =>
        get().cart.find((item) => item.short_slug === short_slug)?.quantity ??
        0,

      getTotalItems: () =>
        get().cart.reduce((total, item) => total + item.quantity, 0),

      isPending: (short_slug) => get().pendingSlugs.includes(short_slug),
    }),
    {
      name: "cart-storage",
      version: 3,
      partialize: (state) => ({ guestCart: state.guestCart }),
      migrate: (persistedState) => {
        const previous = persistedState as {
          cart?: CartItem[];
          guestCart?: CartItem[];
        };
        return { guestCart: previous.guestCart ?? previous.cart ?? [] };
      },
      skipHydration: true,
    },
  ),
);
