import { readData } from "@/core/http-service";
import type {
  OrderCounts,
  OrderDetail,
  OrderSummary,
  OrdersProfileData,
  ProfileOrderStatus,
} from "@/types/order.types";

type LegacyOrdersProfileData = {
  all_orders?: OrderSummary[];
  pending_payment_orders?: OrderSummary[];
  current_orders?: OrderSummary[];
  delivered_orders?: OrderSummary[];
  canceled_orders?: OrderSummary[];
  counts?: Partial<OrderCounts>;
};

const emptyCounts: OrderCounts = {
  all: 0,
  pending_payment: 0,
  current: 0,
  delivered: 0,
  canceled: 0,
};

function normalizeProfileOrders(
  payload: OrdersProfileData | LegacyOrdersProfileData,
  status: ProfileOrderStatus,
  requestedPage: number,
  requestedTake: number,
): OrdersProfileData {
  if ("data" in payload && Array.isArray(payload.data)) {
    const entityCount = Number(payload.entity_count) || payload.data.length;
    const counts = payload.counts ?? emptyCounts;

    return {
      ...payload,
      status: payload.status ?? status,
      counts: {
        all: counts.all ?? (status === "all" ? entityCount : emptyCounts.all),
        pending_payment:
          counts.pending_payment ??
          (status === "pending_payment"
            ? entityCount
            : emptyCounts.pending_payment),
        current:
          counts.current ??
          (status === "current" ? entityCount : emptyCounts.current),
        delivered:
          counts.delivered ??
          (status === "delivered" ? entityCount : emptyCounts.delivered),
        canceled:
          counts.canceled ??
          (status === "canceled" ? entityCount : emptyCounts.canceled),
      },
    };
  }

  const legacy = payload as LegacyOrdersProfileData;
  const statusOrders: Record<ProfileOrderStatus, OrderSummary[]> = {
    all: legacy.all_orders ?? [],
    pending_payment: legacy.pending_payment_orders ?? [],
    current: legacy.current_orders ?? [],
    delivered: legacy.delivered_orders ?? [],
    canceled: legacy.canceled_orders ?? [],
  };
  const selectedOrders = statusOrders[status];
  const take = Math.min(20, Math.max(1, Math.trunc(requestedTake) || 10));
  const pageCount = Math.max(1, Math.ceil(selectedOrders.length / take));
  const currentPage = Math.min(
    pageCount,
    Math.max(1, Math.trunc(requestedPage) || 1),
  );
  const start = (currentPage - 1) * take;

  return {
    data: selectedOrders.slice(start, start + take),
    status,
    counts: {
      all: legacy.counts?.all ?? statusOrders.all.length,
      pending_payment:
        legacy.counts?.pending_payment ?? statusOrders.pending_payment.length,
      current: legacy.counts?.current ?? statusOrders.current.length,
      delivered: legacy.counts?.delivered ?? statusOrders.delivered.length,
      canceled: legacy.counts?.canceled ?? statusOrders.canceled.length,
    },
    entity_count: selectedOrders.length,
    current_page: currentPage,
    page_count: pageCount,
    start_page: Math.max(currentPage - 2, 1),
    end_page: Math.min(currentPage + 2, pageCount),
    take,
    has_next: currentPage < pageCount,
    has_previous: currentPage > 1,
  };
}

export async function getProfileOrders({
  status = "all",
  page = 1,
  take = 10,
}: {
  status?: ProfileOrderStatus;
  page?: number;
  take?: number;
} = {}): Promise<OrdersProfileData> {
  const params = new URLSearchParams({
    status,
    page: String(page),
    take: String(take),
  });
  const response = await readData<OrdersProfileData | LegacyOrdersProfileData>(
    `/api/order/profile/?${params.toString()}`,
  );

  return normalizeProfileOrders(response.data, status, page, take);
}

export async function getProfileOrder(slug: string): Promise<OrderDetail> {
  const response = await readData<OrderDetail>(`/api/order/profile/${slug}`);
  return response.data;
}
