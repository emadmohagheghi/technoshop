"use client";

import AddressCard from "@/app/_components/address/address-card";
import AddressFormDialog from "@/app/_components/address/address-form-dialog";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import SpinnerLoading from "@/app/_components/ui/spinner-loading";
import { getAddresses } from "@/services/addresses-service";
import { getCheckout, updateCheckout } from "@/services/checkout-service";
import type { UserAddress } from "@/types/address.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Add, Edit2, Location, Truck } from "iconsax-reactjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export default function ShippingPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null,
  );
  const attemptedDefaultAddress = useRef<number | null>(null);
  const addressesQuery = useQuery({
    queryKey: ["profile", "addresses"],
    queryFn: getAddresses,
  });
  const checkoutQuery = useQuery({
    queryKey: ["checkout"],
    queryFn: getCheckout,
  });

  const selectAddress = useMutation({
    mutationKey: ["checkout", "selection", "address"],
    mutationFn: (addressId: number) =>
      updateCheckout({ address_id: addressId }),
    onSuccess: (checkout) => queryClient.setQueryData(["checkout"], checkout),
    onError: () => toast.error("انتخاب آدرس ناموفق بود"),
  });
  const selectShipping = useMutation({
    mutationKey: ["checkout", "selection", "shipping"],
    mutationFn: (shippingRateId: number) =>
      updateCheckout({ shipping_rate_id: shippingRateId }),
    onSuccess: (checkout) => queryClient.setQueryData(["checkout"], checkout),
    onError: () => toast.error("انتخاب روش ارسال ناموفق بود"),
  });

  const addresses = useMemo(
    () => addressesQuery.data ?? [],
    [addressesQuery.data],
  );
  const checkout = checkoutQuery.data;
  const selectAddressMutation = selectAddress.mutate;
  const selectionIsPending =
    selectAddress.isPending || selectShipping.isPending;

  const handleSelectAddress = (addressId: number) => {
    if (selectionIsPending || checkout?.address_id === addressId) {
      return;
    }
    selectAddress.mutate(addressId);
  };

  useEffect(() => {
    const defaultAddress = addresses.find((address) => address.is_default);
    if (
      checkout?.address_id == null &&
      defaultAddress &&
      attemptedDefaultAddress.current !== defaultAddress.id
    ) {
      attemptedDefaultAddress.current = defaultAddress.id;
      selectAddressMutation(defaultAddress.id);
    }
  }, [addresses, checkout?.address_id, selectAddressMutation]);

  const openCreate = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };
  const openEdit = (address: UserAddress) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  if (addressesQuery.isLoading || checkoutQuery.isLoading) {
    return <CheckoutLoading />;
  }

  if (addressesQuery.isError || checkoutQuery.isError || !checkout) {
    return (
      <Card>
        <CardContent className="space-y-3 p-6 text-center">
          <p className="text-red-600">دریافت اطلاعات ارسال ناموفق بود.</p>
          <Button
            variant="outline"
            onClick={() => {
              void addressesQuery.refetch();
              void checkoutQuery.refetch();
            }}
          >
            تلاش دوباره
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>آدرس تحویل</CardTitle>
            <p className="mt-1 text-sm text-gray-500">
              یکی از آدرس‌های ذخیره‌شده را انتخاب کنید.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={openCreate}
            disabled={addresses.length >= 5}
          >
            <Add size={18} />
            آدرس جدید
          </Button>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <Location className="mx-auto text-gray-400" size={34} />
              <p className="mt-3 font-semibold">برای ادامه یک آدرس بسازید</p>
              <p className="mt-1 text-sm text-gray-500">
                این آدرس در حساب شما نیز ذخیره خواهد شد.
              </p>
              <Button onClick={openCreate} className="bg-brand-primary mt-4">
                افزودن آدرس
              </Button>
            </div>
          ) : (
            <div role="radiogroup" className="grid gap-4 xl:grid-cols-2">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  selected={checkout.address_id === address.id}
                  disabled={selectionIsPending}
                  loading={
                    selectAddress.isPending &&
                    selectAddress.variables === address.id
                  }
                  onSelect={() => handleSelectAddress(address.id)}
                  actions={
                    <Button
                      variant="ghost"
                      disabled={selectionIsPending}
                      onClick={() => openEdit(address)}
                    >
                      <Edit2 size={17} />
                      ویرایش
                    </Button>
                  }
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>روش ارسال</CardTitle>
          <p className="text-sm text-gray-500">
            گزینه‌ها براساس استان آدرس انتخاب‌شده محاسبه می‌شوند.
          </p>
        </CardHeader>
        <CardContent>
          {selectAddress.isPending ? (
            <div
              role="status"
              className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"
            >
              <SpinnerLoading className="size-5" />
              <div>
                <p className="font-semibold">در حال تغییر آدرس تحویل</p>
                <p className="mt-1 text-xs">
                  روش و هزینه ارسال دوباره محاسبه می‌شود.
                </p>
              </div>
            </div>
          ) : !checkout.address_id ? (
            <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
              برای مشاهده روش‌های ارسال ابتدا یک آدرس انتخاب کنید.
            </p>
          ) : checkout.shipping_unavailable ? (
            <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              برای این آدرس روش ارسال فعالی تعریف نشده است.
            </p>
          ) : !checkout.shipping_selection_required ? (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              <p className="font-semibold">ارسال با هماهنگی فروشگاه</p>
              <p className="mt-1">
                روش، زمان و هزینه احتمالی ارسال پس از ثبت سفارش با شما هماهنگ
                می‌شود.
              </p>
            </div>
          ) : (
            <RadioGroup
              disabled={selectionIsPending}
              value={checkout.shipping_rate_id?.toString() ?? ""}
              onValueChange={(value) => selectShipping.mutate(Number(value))}
              className="space-y-3"
            >
              {checkout.shipping_rates.map((rate) => (
                <label
                  key={rate.id}
                  htmlFor={`shipping-${rate.id}`}
                  className="hover:border-brand-primary flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition"
                >
                  <RadioGroupItem
                    id={`shipping-${rate.id}`}
                    value={rate.id.toString()}
                    className="mt-1"
                  />
                  <Truck className="text-brand-primary shrink-0" size={24} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{rate.service.name}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {rate.pay_at_destination
                        ? "هزینه ارسال هنگام تحویل دریافت می‌شود"
                        : rate.calculated_price === 0
                          ? "ارسال رایگان"
                          : `${rate.calculated_price.toLocaleString("fa-IR")} تومان`}
                    </p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      {checkout.issues
        .filter((issue) => !issue.includes("آدرس") && !issue.includes("ارسال"))
        .map((issue) => (
          <p
            key={issue}
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {issue}
          </p>
        ))}

      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editingAddress}
        onSaved={(address) => handleSelectAddress(address.id)}
      />
    </div>
  );
}

function CheckoutLoading() {
  return (
    <div className="space-y-4">
      <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
    </div>
  );
}
