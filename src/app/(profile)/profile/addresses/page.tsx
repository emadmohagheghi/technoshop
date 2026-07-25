"use client";

import AddressCard from "@/app/_components/address/address-card";
import AddressFormDialog from "@/app/_components/address/address-form-dialog";
import { Button } from "@/app/_components/ui/button";
import {
  deleteAddress,
  getAddresses,
  setDefaultAddress,
} from "@/services/addresses-service";
import type { UserAddress } from "@/types/address.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Add, Edit2, Location, Star1, Trash } from "iconsax-reactjs";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "../_components/confirm-dialog";
import ProfilePageHeader from "../_components/profile-page-header";
import {
  ProfileEmpty,
  ProfileError,
  ProfileLoading,
} from "../_components/profile-states";

export default function AddressesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null,
  );
  const addressesQuery = useQuery({
    queryKey: ["profile", "addresses"],
    queryFn: getAddresses,
  });

  const refreshAddresses = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["profile", "addresses"] }),
      queryClient.invalidateQueries({ queryKey: ["checkout"] }),
    ]);
  };
  const removeAddress = useMutation({
    mutationFn: deleteAddress,
    onSuccess: async () => {
      await refreshAddresses();
      toast.success("آدرس حذف شد");
    },
    onError: () => toast.error("حذف آدرس ناموفق بود"),
  });
  const makeDefault = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: async () => {
      await refreshAddresses();
      toast.success("آدرس پیش‌فرض تغییر کرد");
    },
    onError: () => toast.error("تغییر آدرس پیش‌فرض ناموفق بود"),
  });

  const openCreate = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };
  const openEdit = (address: UserAddress) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };
  const addresses = addressesQuery.data ?? [];

  return (
    <div className="space-y-5">
      <section className="rounded-xl border bg-white p-4 sm:p-6">
        <ProfilePageHeader
          title="آدرس‌های من"
          description={`${addresses.length.toLocaleString("fa-IR")} از ۵ آدرس ثبت‌شده`}
          action={
            <Button
              onClick={openCreate}
              disabled={addresses.length >= 5}
              className="bg-brand-primary hover:bg-brand-primary-focus"
            >
              <Add size={18} />
              افزودن آدرس
            </Button>
          }
        />
      </section>

      {addressesQuery.isLoading ? (
        <ProfileLoading />
      ) : addressesQuery.isError ? (
        <ProfileError onRetry={() => void addressesQuery.refetch()} />
      ) : addresses.length === 0 ? (
        <ProfileEmpty
          title="هنوز آدرسی ثبت نکرده‌اید"
          description="برای سریع‌تر شدن فرایند خرید، نشانی تحویل خود را اضافه کنید."
          icon={<Location size={28} />}
          action={
            <Button onClick={openCreate} className="bg-brand-primary">
              افزودن اولین آدرس
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              actions={
                <>
                  {!address.is_default && (
                    <Button
                      variant="ghost"
                      disabled={makeDefault.isPending}
                      onClick={() => makeDefault.mutate(address.id)}
                    >
                      <Star1 size={17} />
                      انتخاب به‌عنوان پیش‌فرض
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => openEdit(address)}>
                    <Edit2 size={17} />
                    ویرایش
                  </Button>
                  <ConfirmDialog
                    title="حذف آدرس"
                    description="این آدرس از حساب شما حذف می‌شود. سفارش‌های قبلی تغییری نمی‌کنند."
                    confirmLabel="حذف آدرس"
                    pending={
                      removeAddress.isPending &&
                      removeAddress.variables === address.id
                    }
                    onConfirm={() => removeAddress.mutateAsync(address.id)}
                    trigger={
                      <Button variant="ghost" className="text-red-600">
                        <Trash size={17} />
                        حذف
                      </Button>
                    }
                  />
                </>
              }
            />
          ))}
        </div>
      )}

      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editingAddress}
      />
    </div>
  );
}
