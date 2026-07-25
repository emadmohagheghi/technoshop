import { Badge } from "@/app/_components/ui/badge";
import SpinnerLoading from "@/app/_components/ui/spinner-loading";
import { cn } from "@/lib/utils";
import type { UserAddress } from "@/types/address.types";
import { Location, TickCircle } from "iconsax-reactjs";

interface AddressCardProps {
  address: UserAddress;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onSelect?: () => void;
  actions?: React.ReactNode;
}

export default function AddressCard({
  address,
  selected = false,
  disabled = false,
  loading = false,
  onSelect,
  actions,
}: AddressCardProps) {
  return (
    <article
      role={onSelect ? "radio" : undefined}
      aria-checked={onSelect ? selected : undefined}
      aria-disabled={onSelect ? disabled : undefined}
      aria-busy={loading || undefined}
      tabIndex={onSelect ? (disabled ? -1 : 0) : undefined}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={(event) => {
        if (
          onSelect &&
          !disabled &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "rounded-xl border bg-white p-5 shadow-sm transition",
        onSelect && !disabled && "hover:border-brand-primary/60 cursor-pointer",
        disabled && "cursor-wait opacity-70",
        selected && "border-brand-primary ring-brand-primary/15 ring-2",
        loading && "border-brand-primary ring-brand-primary/15 ring-2",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="bg-brand-primary-content text-brand-primary grid size-10 shrink-0 place-items-center rounded-lg">
          <Location size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-gray-900">{address.title}</p>
            {address.is_default && <Badge variant="secondary">پیش‌فرض</Badge>}
            {loading ? (
              <Badge className="bg-brand-primary mr-auto gap-1 text-white">
                <SpinnerLoading className="size-3.5 fill-white text-white/30" />
                در حال انتخاب...
              </Badge>
            ) : selected ? (
              <Badge className="bg-brand-primary mr-auto gap-1 text-white">
                <TickCircle size={14} />
                انتخاب‌شده
              </Badge>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {address.receiver_province}، {address.receiver_city}
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-700">
            {address.receiver_address}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            پلاک {address.receiver_building_number || "—"}، واحد{" "}
            {address.receiver_unit || "—"}
          </p>
          <div className="mt-4 space-y-1 border-t pt-4 text-sm text-gray-600">
            <p>
              گیرنده: {address.receiver_name} {address.receiver_family}
            </p>
            <p>موبایل: {address.receiver_phone}</p>
            <p>کد پستی: {address.receiver_postal_code}</p>
          </div>
        </div>
      </div>
      {actions && (
        <div
          className="mt-4 flex flex-wrap justify-end gap-2"
          onClick={(event) => event.stopPropagation()}
        >
          {actions}
        </div>
      )}
    </article>
  );
}
