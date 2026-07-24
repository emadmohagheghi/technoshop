import { createData, deleteData, readData } from "@/core/http-service";
import { Product } from "@/types/product.types";

const FAVORITES_URL = "/api/users/favorite/";

export async function getFavoriteProducts(): Promise<Product[]> {
  const response = await readData<Product[]>(FAVORITES_URL);
  return response.data;
}

export async function mergeFavoriteProducts(
  productIds: number[],
): Promise<void> {
  if (productIds.length === 0) return;

  await createData<{ product_ids: number[]; merge: true }, null>(
    FAVORITES_URL,
    {
      product_ids: productIds,
      merge: true,
    },
  );
}

export async function removeFavoriteProduct(productId: number): Promise<void> {
  await deleteData(FAVORITES_URL, { product_id: productId });
}
