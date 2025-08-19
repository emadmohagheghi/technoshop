export type Product = {
  id: number;
  image: string;
  title_ir: string;
  title_en: string;
  url: string;
  stockrecord: {
    sale_price: number;
    special_sale_price?: number | null;
    special_sale_price_start_at: Date | null;
    special_sale_price_end_at: Date | null;
    num_stock?: number;
    in_order_limit?: number | null;
  };
  track_stock?: boolean;
  is_available_in_stock?: boolean;
  brand: {
    title_ir: string;
    title_en: string;
    slug: string;
  };
  isFavorite?: boolean;
};

export type ProductDetail = {
  id: number;
  product_class: ProductClass;
  structure: string;
  attribute_values: Record<string, unknown>;
  images: Image[];
  url: string;
  title_ir: string;
  title_en: string;
  short_slug: number;
  description: string | null;
  stockrecord: Stockrecord;
  is_available_in_stock: boolean;
  brand: Brand;
  meta_title: string | null;
  meta_description: string;
  properties: Property2[];
  recommended_products: Product[];
  comment_count: number;
  children: Children[];
};

export type ProductClass = {
  id: number;
  title_ir: string;
  title_en: string;
  track_stock: boolean;
  require_shipping: boolean;
  properties: Property[];
};

export type Property = {
  id: number;
  name: string;
};

export type Image = {
  id: number;
  image: Image2;
};

export type Image2 = {
  name: string;
};

export type Stockrecord = {
  id: number;
  sku: string | null;
  sale_price: number;
  special_sale_price: number;
  special_sale_price_start_at: string | null;
  special_sale_price_end_at: string | null;
  num_stock: number;
  in_order_limit: number | null;
};

export type Brand = {
  id: number;
  image: Image3;
  title_ir: string;
  title_en: string;
  slug: string;
};

export type Image3 = {
  name: string;
};

export type Property2 = {
  id: number;
  property: Property3;
  value: string;
};

export type Property3 = {
  id: number;
  name: string;
};

export type Children = {
  id: number;
  stockrecord: Stockrecord2;
  attribute_values: Record<string, unknown>;
  images: Image[];
};

export type Stockrecord2 = {
  id: number;
  sku: string;
  sale_price: number;
  special_sale_price: number;
  special_sale_price_start_at: string | null;
  special_sale_price_end_at: string | null;
  num_stock: number;
  in_order_limit: number | null;
};
