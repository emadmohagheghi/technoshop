import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getFavoriteProducts,
  mergeFavoriteProducts,
  removeFavoriteProduct,
} from "@/services/favorites-service";

type FavoritesSource = "uninitialized" | "guest" | "server";
type FavoritesStatus = "idle" | "loading" | "ready" | "error";

interface FavoritesStore {
  productIds: number[];
  guestProductIds: number[];
  source: FavoritesSource;
  status: FavoritesStatus;
  error: string | null;
  pendingProductIds: number[];

  initialize: (isAuthenticated: boolean) => Promise<boolean>;
  toggle: (productId: number) => Promise<boolean>;
  isFavorite: (productId: number) => boolean;
  isPending: (productId: number) => boolean;
}

let initializationId = 0;
const MAX_FAVORITES = 20;

const removeProductId = (productIds: number[], productId: number) =>
  productIds.filter((id) => id !== productId);

const addProductId = (productIds: number[], productId: number) =>
  [...removeProductId(productIds, productId), productId].slice(-MAX_FAVORITES);

const favoriteIds = (products: { id: number }[]) => [
  ...new Set(products.map((product) => product.id)),
];

const hydrateGuestFavorites = async () => {
  if (!useFavoritesStore.persist.hasHydrated()) {
    await useFavoritesStore.persist.rehydrate();
  }
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      guestProductIds: [],
      source: "uninitialized",
      status: "idle",
      error: null,
      pendingProductIds: [],

      initialize: async (isAuthenticated) => {
        const currentInitialization = ++initializationId;
        await hydrateGuestFavorites();

        if (currentInitialization !== initializationId) return false;

        const guestProductIds = get().guestProductIds;
        set({ status: "loading", error: null, pendingProductIds: [] });

        if (!isAuthenticated) {
          set({
            productIds: guestProductIds,
            source: "guest",
            status: "ready",
            error: null,
            pendingProductIds: [],
          });
          return true;
        }

        try {
          let serverProducts = await getFavoriteProducts();
          const serverProductIds = favoriteIds(serverProducts);
          const missingGuestProductIds = guestProductIds.filter(
            (productId) => !serverProductIds.includes(productId),
          );

          if (missingGuestProductIds.length > 0) {
            await mergeFavoriteProducts(missingGuestProductIds);
            serverProducts = await getFavoriteProducts();
          }

          if (currentInitialization !== initializationId) return false;

          set({
            productIds: favoriteIds(serverProducts),
            guestProductIds: [],
            source: "server",
            status: "ready",
            error: null,
            pendingProductIds: [],
          });
          return true;
        } catch {
          if (currentInitialization === initializationId) {
            set({
              source: "server",
              status: "error",
              error: "favorites_initialization_failed",
              pendingProductIds: [],
            });
          }
          return false;
        }
      },

      toggle: async (productId) => {
        if (
          !Number.isInteger(productId) ||
          get().status !== "ready" ||
          get().pendingProductIds.includes(productId)
        ) {
          return false;
        }

        const wasFavorite = get().productIds.includes(productId);
        const optimisticProductIds = wasFavorite
          ? removeProductId(get().productIds, productId)
          : addProductId(get().productIds, productId);

        if (get().source === "guest") {
          set({
            productIds: optimisticProductIds,
            guestProductIds: optimisticProductIds,
            error: null,
          });
          return true;
        }

        if (get().source !== "server") return false;

        const favoriteSession = initializationId;
        set((state) => ({
          productIds: wasFavorite
            ? removeProductId(state.productIds, productId)
            : addProductId(state.productIds, productId),
          pendingProductIds: [...state.pendingProductIds, productId],
          error: null,
        }));

        try {
          if (wasFavorite) {
            await removeFavoriteProduct(productId);
          } else {
            await mergeFavoriteProducts([productId]);
          }
          if (favoriteSession !== initializationId) return false;

          set((state) => ({
            pendingProductIds: removeProductId(
              state.pendingProductIds,
              productId,
            ),
          }));
          return true;
        } catch {
          if (favoriteSession !== initializationId) return false;

          set((state) => ({
            productIds: wasFavorite
              ? addProductId(state.productIds, productId)
              : removeProductId(state.productIds, productId),
            pendingProductIds: removeProductId(
              state.pendingProductIds,
              productId,
            ),
            error: "favorite_update_failed",
          }));
          return false;
        }
      },

      isFavorite: (productId) => get().productIds.includes(productId),
      isPending: (productId) => get().pendingProductIds.includes(productId),
    }),
    {
      name: "favorites-storage",
      version: 1,
      partialize: (state) => ({ guestProductIds: state.guestProductIds }),
      migrate: (persistedState) => {
        const previous = persistedState as {
          productIds?: number[];
          guestProductIds?: number[];
        };
        return {
          guestProductIds:
            previous.guestProductIds ?? previous.productIds ?? [],
        };
      },
      skipHydration: true,
    },
  ),
);
