export function imageUrl(name: string): string {
  return `http://localhost:8000/media/${name}`;
}

export function calculateDiscountPercentage(
  originalPrice: number,
  discountedPrice: number
): number | null{
  if (originalPrice <= 0) return 0;
  if (!discountedPrice) return null;
  return Math.floor(((originalPrice - discountedPrice) / originalPrice) * 100);
}
