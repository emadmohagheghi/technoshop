import {
  deleteData,
  readData,
  updateData,
  createData,
} from "@/core/http-service";
import { ApiResponseType } from "@/types/response";

export type ServerCartItem = {
  short_slug: number;
  quantity: number;
};

export type ServerCart = {
  order_id: number;
  items: ServerCartItem[];
};

export type SetCartQuantityRequest = {
  short_slug: number;
  quantity: number;
};

const CART_URL = "/api/order/cart/";

export function getCart(): Promise<ApiResponseType<ServerCart>> {
  return readData<ServerCart>(CART_URL);
}

export function setServerCartQuantity(
  request: SetCartQuantityRequest,
): Promise<ApiResponseType<ServerCart>> {
  return updateData<SetCartQuantityRequest, ServerCart>(CART_URL, request);
}

export function clearServerCart(): Promise<ApiResponseType<ServerCart>> {
  return deleteData<ServerCart>(CART_URL);
}

export function mergeGuestCart(
  items: ServerCartItem[],
): Promise<ApiResponseType<ServerCart>> {
  return createData<{ items: ServerCartItem[] }, ServerCart>(
    `${CART_URL}merge/`,
    { items },
  );
}
