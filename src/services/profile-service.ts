import { getFavoriteProducts } from "@/services/favorites-service";
import { getProfileOrders } from "@/services/orders-service";
import { getRecentProducts } from "@/services/recent-products-service";
import { readData } from "@/core/http-service";
import type { ProfileDashboardData } from "@/types/profile.types";
import { getHttpErrorStatus } from "@/utils/http-error";

export async function getProfileDashboard(): Promise<ProfileDashboardData> {
  try {
    const response = await readData<ProfileDashboardData>(
      "/api/users/profile/dashboard/",
    );
    return response.data;
  } catch (error) {
    if (getHttpErrorStatus(error) !== 404) throw error;

    const [currentOrders, favoriteProducts, recentProducts] = await Promise.all(
      [
        getProfileOrders({ status: "current", page: 1, take: 1 }),
        getFavoriteProducts(),
        getRecentProducts(),
      ],
    );
    let latestOrder = currentOrders.data[0] ?? null;

    if (!latestOrder) {
      const allOrders = await getProfileOrders({
        status: "all",
        page: 1,
        take: 1,
      });
      latestOrder = allOrders.data[0] ?? null;
    }

    return {
      orders: {
        counts: currentOrders.counts,
        latest_order: latestOrder,
      },
      favorite_products: favoriteProducts.slice(0, 4),
      recent_products: recentProducts.slice(0, 4),
    };
  }
}
