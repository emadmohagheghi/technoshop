import { getBanners } from "@/services/banners-services";
import { useQuery } from "@tanstack/react-query";

export function useBanner() {
  return useQuery({
    queryKey: ["banner"],
    queryFn: getBanners,
  });
}
