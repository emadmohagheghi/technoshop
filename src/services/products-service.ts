import { readData } from "@/core/http-service";
import { Product, ProductDetail, Stockrecord } from "@/types/product.types";
import { ApiFilterResultType } from "@/types/response";

export function getPurchasableStockrecord(product: ProductDetail): Stockrecord {
  if (product.structure !== "parent" || product.children.length === 0) {
    return product.stockrecord;
  }

  const child =
    product.children.find(
      (candidate) =>
        !product.product_class.track_stock ||
        candidate.stockrecord.num_stock > 0,
    ) ?? product.children[0];

  return child.stockrecord;
}

export async function getProducts(query?: string) {
  const res = await readData<ApiFilterResultType<Product>>(
    "/api/catalog/search/" + query,
  );
  return res.data.data;
}

export async function getNewestProducts() {
  const res = await readData<ApiFilterResultType<Product>>(
    "/api/catalog/search/?sort=1",
  );
  return res.data.data.slice(0, 10);
}

export async function getSpecialProducts() {
  const res = await readData<ApiFilterResultType<Product>>(
    "/api/catalog/search/?special=true",
  );
  return res.data.data;
}

export async function getBestSellingProducts() {
  const res = await readData<ApiFilterResultType<Product>>(
    "/api/catalog/search/?sort=2",
  );
  return res.data.data;
}

export async function getProductByShortSlug(short_slug: number) {
  const res = await readData<ProductDetail>(
    `/api/catalog/product/${short_slug}/`,
  );
  return {
    ...res.data,
    stockrecord: getPurchasableStockrecord(res.data),
  };
}
