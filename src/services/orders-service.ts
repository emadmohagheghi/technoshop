import { readData } from "@/core/http-service";
import { OrderDetail, OrdersProfileData } from "@/types/order.types";

export async function getProfileOrders(): Promise<OrdersProfileData> {
  const response = await readData<OrdersProfileData>("/api/order/profile/");
  return response.data;
}

export async function getProfileOrder(slug: string): Promise<OrderDetail> {
  const response = await readData<OrderDetail>(`/api/order/profile/${slug}`);
  return response.data;
}
