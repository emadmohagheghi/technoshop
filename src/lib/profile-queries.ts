import { getAddresses } from "@/services/addresses-service";
import { getFavoriteProducts } from "@/services/favorites-service";
import { getProfileOrder, getProfileOrders } from "@/services/orders-service";
import { getRecentProducts } from "@/services/recent-products-service";
import { queryOptions } from "@tanstack/react-query";

const PROFILE_GC_TIME = 1000 * 60 * 30;
const PROFILE_STALE_TIME = 1000 * 60 * 5;
const ADDRESSES_STALE_TIME = 1000 * 60 * 10;

export const profileQueryKeys = {
  all: ["profile"] as const,
  orders: ["profile", "orders"] as const,
  order: (slug: string) => ["profile", "orders", slug] as const,
  favorites: ["profile", "favorites"] as const,
  recent: ["profile", "recent"] as const,
  addresses: ["profile", "addresses"] as const,
};

export const profileOrdersQueryOptions = () =>
  queryOptions({
    queryKey: profileQueryKeys.orders,
    queryFn: getProfileOrders,
    staleTime: PROFILE_STALE_TIME,
    gcTime: PROFILE_GC_TIME,
  });

export const profileOrderQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: profileQueryKeys.order(slug),
    queryFn: () => getProfileOrder(slug),
    staleTime: PROFILE_STALE_TIME,
    gcTime: PROFILE_GC_TIME,
  });

export const profileFavoritesQueryOptions = () =>
  queryOptions({
    queryKey: profileQueryKeys.favorites,
    queryFn: getFavoriteProducts,
    staleTime: PROFILE_STALE_TIME,
    gcTime: PROFILE_GC_TIME,
  });

export const profileRecentQueryOptions = () =>
  queryOptions({
    queryKey: profileQueryKeys.recent,
    queryFn: getRecentProducts,
    staleTime: PROFILE_STALE_TIME,
    gcTime: PROFILE_GC_TIME,
  });

export const profileAddressesQueryOptions = () =>
  queryOptions({
    queryKey: profileQueryKeys.addresses,
    queryFn: getAddresses,
    staleTime: ADDRESSES_STALE_TIME,
    gcTime: PROFILE_GC_TIME,
  });
