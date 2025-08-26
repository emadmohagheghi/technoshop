export function imageUrl(name: string): string {
  return `http://localhost:8000/media/${name}`;
}

export function calculateDiscountPercentage(
  originalPrice: number,
  discountedPrice: number,
): number | null {
  if (originalPrice <= 0) return 0;
  if (!discountedPrice) return null;
  return Math.floor(((originalPrice - discountedPrice) / originalPrice) * 100);
}

// Price filter utility functions
export function formatPriceFilter(min: number, max: number): string {
  return `${min},${max}`;
}

export function parsePriceFilter(priceFilter: string | null): {
  min: number | null;
  max: number | null;
} {
  if (!priceFilter) return { min: null, max: null };

  const parts = priceFilter.split(",");
  if (parts.length !== 2) return { min: null, max: null };

  const min = parseInt(parts[0]);
  const max = parseInt(parts[1]);

  if (isNaN(min) || isNaN(max)) return { min: null, max: null };

  return { min, max };
}

// Helper function to create price filter with defaults
export function createPriceFilter(
  min?: number | null,
  max?: number | null,
): string {
  const minPrice = min ?? 0;
  const maxPrice = max ?? 500000000;
  return `${minPrice},${maxPrice}`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(price);
}
