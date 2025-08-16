import { readData } from '@/core/http-service';
import { Banner } from '@/types/banner.types';

export async function getBanners() {
  const res = await readData<{ banners: Banner[] }>('/api/content/home/data');
  return res.data.banners;
}
