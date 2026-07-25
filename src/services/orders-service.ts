import { readData } from "@/core/http-service";
import {
  OrderDetail,
  OrdersProfileData,
  type ProfileOrderStatus,
} from "@/types/order.types";

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
  const response = await readData<OrdersProfileData>(
    `/api/order/profile/?${params.toString()}`,
  );
  return response.data;
}

export async function getProfileOrder(slug: string): Promise<OrderDetail> {
  const response = await readData<OrderDetail>(`/api/order/profile/${slug}`);
  return response.data;
}
