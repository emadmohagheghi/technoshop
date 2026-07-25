import { ReactNode } from "react";

export default function ProfilePageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
