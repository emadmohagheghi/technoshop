"use client";

import { profileQueryKeys } from "@/lib/profile-queries";
import { recordRecentProduct } from "@/services/recent-products-service";
import { useUserStore } from "@/stores/user.store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

interface RecentProductTrackerProps {
  productId: number;
}

export default function RecentProductTracker({
  productId,
}: RecentProductTrackerProps) {
  const authStatus = useUserStore((state) => state.status);
  const queryClient = useQueryClient();
  const trackedProductId = useRef<number | null>(null);

  useEffect(() => {
    if (
      authStatus !== "authenticated" ||
      trackedProductId.current === productId
    ) {
      return;
    }

    trackedProductId.current = productId;

    void recordRecentProduct(productId)
      .then(() =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: profileQueryKeys.recent,
          }),
          queryClient.invalidateQueries({
            queryKey: profileQueryKeys.dashboard,
          }),
        ]),
      )
      .catch(() => {
        trackedProductId.current = null;
      });
  }, [authStatus, productId, queryClient]);

  return null;
}
