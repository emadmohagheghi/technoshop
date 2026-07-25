import {
  createData,
  deleteData,
  readData,
  updateData,
} from "@/core/http-service";
import { ApiResponseType } from "@/types/response";
import { getHttpErrorStatus } from "@/utils/http-error";

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

async function mergeGuestCartWithLegacyApi(items: ServerCartItem[]) {
  let response = await getCart();

  for (const item of items) {
    if (
      !Number.isInteger(item.short_slug) ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      continue;
    }

    const currentQuantity =
      response.data.items.find(
        (serverItem) => serverItem.short_slug === item.short_slug,
      )?.quantity ?? 0;

    try {
      response = await setServerCartQuantity({
        short_slug: item.short_slug,
        quantity: Math.min(100, currentQuantity + item.quantity),
      });
    } catch {
      // A stale or unavailable guest item must not block the rest of the merge.
    }
  }

  return response;
}

export async function mergeGuestCart(
  items: ServerCartItem[],
): Promise<ApiResponseType<ServerCart>> {
  try {
    return await createData<{ items: ServerCartItem[] }, ServerCart>(
      `${CART_URL}merge/`,
      { items },
    );
  } catch (error) {
    if (getHttpErrorStatus(error) !== 404) throw error;
    return mergeGuestCartWithLegacyApi(items);
  }
}
