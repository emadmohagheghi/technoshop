"use client";

import { subscribeToServerCartChanges } from "@/lib/cart-sync";
import { useCartStore, type CartItem } from "@/stores/cart.store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const GUEST_CART_STORAGE_KEY = "cart-storage";
const FOCUS_REFRESH_INTERVAL = 15_000;

const readGuestCart = (value: string): CartItem[] | null => {
  try {
    const persisted = JSON.parse(value) as {
      state?: { guestCart?: unknown };
    };
    const items = persisted.state?.guestCart;

    if (!Array.isArray(items)) return null;

    return items.flatMap((item): CartItem[] => {
      if (!item || typeof item !== "object") return [];

      const candidate = item as Partial<CartItem>;
      return Number.isInteger(candidate.short_slug) &&
        Number.isInteger(candidate.quantity)
        ? [
            {
              short_slug: candidate.short_slug as number,
              quantity: candidate.quantity as number,
            },
          ]
        : [];
    });
  } catch {
    return null;
  }
};

export default function CartSyncProvider() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let isDisposed = false;
    let refreshQueued = false;
    let refreshInFlight: Promise<void> | null = null;
    let lastRefreshAt = 0;

    const requestServerRefresh = (force = false) => {
      const state = useCartStore.getState();

      if (state.source !== "server") return;

      if (
        state.status === "loading" ||
        state.pendingSlugs.length > 0 ||
        state.isClearing ||
        refreshInFlight
      ) {
        refreshQueued = true;
        return;
      }

      if (!force && Date.now() - lastRefreshAt < FOCUS_REFRESH_INTERVAL) {
        return;
      }

      lastRefreshAt = Date.now();
      refreshInFlight = (async () => {
        const refreshed = await state.refresh();
        if (refreshed) {
          await queryClient.invalidateQueries({ queryKey: ["checkout"] });
        }
      })()
        .catch(() => undefined)
        .finally(() => {
          refreshInFlight = null;

          if (!isDisposed && refreshQueued) {
            refreshQueued = false;
            requestServerRefresh(true);
          }
        });
    };

    const unsubscribeChannel = subscribeToServerCartChanges(() => {
      requestServerRefresh(true);
    });
    const unsubscribeStore = useCartStore.subscribe((state) => {
      if (
        refreshQueued &&
        state.source === "server" &&
        state.status === "ready" &&
        state.pendingSlugs.length === 0 &&
        !state.isClearing &&
        !refreshInFlight
      ) {
        refreshQueued = false;
        requestServerRefresh(true);
      }
    });
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== GUEST_CART_STORAGE_KEY || !event.newValue) return;

      const guestCart = readGuestCart(event.newValue);
      if (guestCart) {
        useCartStore.getState().syncGuestCart(guestCart);
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestServerRefresh();
      }
    };
    const handleFocus = () => requestServerRefresh();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isDisposed = true;
      unsubscribeChannel();
      unsubscribeStore();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [queryClient]);

  return null;
}
