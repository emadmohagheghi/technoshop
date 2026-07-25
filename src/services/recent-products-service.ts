import { createData, deleteData, readData } from "@/core/http-service";
import type { Product } from "@/types/product.types";

const RECENT_URL = "/api/users/recent-product/";

export async function getRecentProducts(): Promise<Product[]> {
  const response = await readData<Product[]>(RECENT_URL);
  return response.data;
}

export async function recordRecentProduct(productId: number) {
  return createData<{ product_ids: number[] }, void>(RECENT_URL, {
    product_ids: [productId],
  });
}

export async function removeRecentProduct(productId: number) {
  return deleteData(RECENT_URL, { product_id: productId });
}

export async function clearRecentProducts() {
  return deleteData("/api/users/recent-product/clear/");
}
