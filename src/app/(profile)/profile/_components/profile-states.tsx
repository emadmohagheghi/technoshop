import { Button } from "@/app/_components/ui/button";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { Box, Refresh } from "iconsax-reactjs";
import { ReactNode } from "react";

export function ProfileLoading({ cards = 3 }: { cards?: number }) {
  return (
    <div className="space-y-4" aria-label="در حال بارگذاری">
      {Array.from({ length: cards }).map((_, index) => (
        <Skeleton key={index} className="h-36 w-full rounded-xl bg-gray-200" />
      ))}
    </div>
  );
}

export function ProfileEmpty({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-white p-8 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-full bg-gray-100 text-gray-500">
        {icon ?? <Box size={28} />}
      </div>
      <h2 className="font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ProfileError({
  onRetry,
  message = "دریافت اطلاعات با مشکل روبه‌رو شد.",
}: {
  onRetry: () => void;
  message?: string;
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border bg-white p-8 text-center">
      <Refresh size={32} className="text-error" />
      <p className="mt-3 text-sm text-gray-700">{message}</p>
      <Button className="mt-4" variant="outline" onClick={onRetry}>
        تلاش دوباره
      </Button>
    </div>
  );
}
