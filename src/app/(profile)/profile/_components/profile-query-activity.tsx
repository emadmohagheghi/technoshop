"use client";

import { profileQueryKeys } from "@/lib/profile-queries";
import { useIsFetching } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";

export default function ProfileQueryActivity() {
  const activeQueries = useIsFetching({ queryKey: profileQueryKeys.all });

  if (activeQueries === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border bg-white/95 px-3 py-2 text-xs text-gray-600 shadow-lg backdrop-blur-sm"
    >
      <LoaderCircle className="text-brand-primary size-4 animate-spin" />
      <span>در حال به‌روزرسانی اطلاعات</span>
    </div>
  );
}
