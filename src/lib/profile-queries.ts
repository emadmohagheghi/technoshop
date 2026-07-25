import { getAddresses } from "@/services/addresses-service";
import { getFavoriteProducts } from "@/services/favorites-service";
import { getProfileOrder, getProfileOrders } from "@/services/orders-service";
import { getProfileDashboard } from "@/services/profile-service";
import { getRecentProducts } from "@/services/recent-products-service";
import type { ProfileOrderStatus } from "@/types/order.types";
import {
  keepPreviousData,
  queryOptions,
  type QueryClient,
} from "@tanstack/react-query";

const PROFILE_GC_TIME = 1000 * 60 * 30;
const PROFILE_STALE_TIME = 1000 * 60 * 5;
const ADDRESSES_STALE_TIME = 1000 * 60 * 10;

export const profileQueryKeys = {
  all: ["profile"] as const,
  dashboard: ["profile", "dashboard"] as const,
  orders: ["profile", "orders"] as const,
  orderList: (status: ProfileOrderStatus, page: number, take: number) =>
    ["profile", "orders", "list", status, page, take] as const,
  order: (slug: string) => ["profile", "orders", slug] as const,
  favorites: ["profile", "favorites"] as const,
  recent: ["profile", "recent"] as const,
  addresses: ["profile", "addresses"] as const,
};

export const profileDashboardQueryOptions = () =>
  queryOptions({
    queryKey: profileQueryKeys.dashboard,
    queryFn: getProfileDashboard,
    staleTime: PROFILE_STALE_TIME,
    gcTime: PROFILE_GC_TIME,
  });

export const profileOrdersQueryOptions = (
  status: ProfileOrderStatus = "all",
  page = 1,
  take = 10,
) =>
  queryOptions({
    queryKey: profileQueryKeys.orderList(status, page, take),
    queryFn: () => getProfileOrders({ status, page, take }),
    placeholderData: keepPreviousData,
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

export function prefetchProfileRouteData(
  queryClient: QueryClient,
  href: string,
) {
  switch (href) {
    case "/profile":
      return queryClient.prefetchQuery(profileDashboardQueryOptions());
    case "/profile/orders":
      return queryClient.prefetchQuery(profileOrdersQueryOptions());
    case "/profile/favorites":
      return queryClient.prefetchQuery(profileFavoritesQueryOptions());
    case "/profile/recent":
      return queryClient.prefetchQuery(profileRecentQueryOptions());
    case "/profile/addresses":
      return queryClient.prefetchQuery(profileAddressesQueryOptions());
    default:
      return Promise.resolve();
  }
}
