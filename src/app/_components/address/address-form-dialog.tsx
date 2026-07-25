"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  createAddress,
  getAddressChoices,
  updateAddress,
} from "@/services/addresses-service";
import {
  type AddressFormData,
  type UserAddress,
  addressSchema,
} from "@/types/address.types";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const emptyAddress: AddressFormData = {
  title: "خانه",
  receiver_name: "",
  receiver_family: "",
  receiver_phone: "",
  receiver_national_code: "",
  receiver_province: "",
  receiver_city: "",
  receiver_postal_code: "",
  receiver_building_number: "",
  receiver_unit: "",
  receiver_address: "",
};

function toFormData(address: UserAddress): AddressFormData {
  return {
    title: address.title,
    receiver_name: address.receiver_name,
    receiver_family: address.receiver_family,
    receiver_phone: address.receiver_phone,
    receiver_national_code: address.receiver_national_code,
    receiver_province: address.receiver_province,
    receiver_city: address.receiver_city,
    receiver_postal_code: address.receiver_postal_code ?? "",
    receiver_building_number: address.receiver_building_number ?? "",
    receiver_unit: address.receiver_unit ?? "",
    receiver_address: address.receiver_address,
  };
}

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: UserAddress | null;
  onSaved?: (address: UserAddress) => void;
}

export default function AddressFormDialog({
  open,
  onOpenChange,
  address,
  onSaved,
}: AddressFormDialogProps) {
  const queryClient = useQueryClient();
  const choicesQuery = useQuery({
    queryKey: ["profile", "address-choices"],
    queryFn: getAddressChoices,
    staleTime: Infinity,
    enabled: open,
  });
  const provinceChoices = useMemo(
    () => [...new Set(choicesQuery.data?.provinces ?? [])],
    [choicesQuery.data?.provinces],
  );
  const cityChoices = useMemo(
    () => [...new Set(choicesQuery.data?.cities ?? [])],
    [choicesQuery.data?.cities],
  );
  const form = useForm<AddressFormData>({
    resolver: valibotResolver(addressSchema),
    defaultValues: emptyAddress,
  });

  useEffect(() => {
    if (open) {
      form.reset(address ? toFormData(address) : emptyAddress);
    }
  }, [address, form, open]);

  const saveAddress = useMutation({
    mutationFn: async (data: AddressFormData) => {
      const response = address
        ? await updateAddress(address.id, data)
        : await createAddress(data);
      return response.data;
    },
    onSuccess: async (savedAddress) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profile", "addresses"] }),
        queryClient.invalidateQueries({ queryKey: ["checkout"] }),
      ]);
      toast.success(
        address ? "آدرس با موفقیت ویرایش شد" : "آدرس جدید ذخیره شد",
      );
      onSaved?.(savedAddress);
      onOpenChange(false);
    },
    onError: () => toast.error("ذخیره آدرس ناموفق بود؛ اطلاعات را بررسی کنید"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
      >
        <DialogHeader className="text-right">
          <DialogTitle>
            {address ? "ویرایش آدرس" : "افزودن آدرس جدید"}
          </DialogTitle>
          <DialogDescription>
            اطلاعات گیرنده و نشانی دقیق محل تحویل را وارد کنید.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((data) => saveAddress.mutate(data))}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <FormField
              label="عنوان آدرس"
              error={form.formState.errors.title?.message}
            >
              <Input
                placeholder="مثلاً خانه یا محل کار"
                {...form.register("title")}
              />
            </FormField>
          </div>
          <FormField
            label="نام گیرنده"
            error={form.formState.errors.receiver_name?.message}
          >
            <Input {...form.register("receiver_name")} />
          </FormField>
          <FormField
            label="نام خانوادگی گیرنده"
            error={form.formState.errors.receiver_family?.message}
          >
            <Input {...form.register("receiver_family")} />
          </FormField>
          <FormField
            label="شماره موبایل"
            error={form.formState.errors.receiver_phone?.message}
          >
            <Input
              dir="ltr"
              inputMode="numeric"
              maxLength={11}
              {...form.register("receiver_phone")}
            />
          </FormField>
          <FormField
            label="کد ملی گیرنده"
            error={form.formState.errors.receiver_national_code?.message}
          >
            <Input
              dir="ltr"
              inputMode="numeric"
              maxLength={10}
              {...form.register("receiver_national_code")}
            />
          </FormField>
          <FormField
            label="استان"
            error={form.formState.errors.receiver_province?.message}
          >
            <select
              {...form.register("receiver_province")}
              className="focus:border-brand-primary h-9 w-full rounded-md border bg-white px-3 text-sm outline-none"
            >
              <option value="">انتخاب استان</option>
              {provinceChoices.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            label="شهر"
            error={form.formState.errors.receiver_city?.message}
          >
            <Input
              list="address-city-options"
              placeholder="نام شهر را بنویسید"
              {...form.register("receiver_city")}
            />
            <datalist id="address-city-options">
              {cityChoices.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </FormField>
          <FormField
            label="کد پستی"
            error={form.formState.errors.receiver_postal_code?.message}
          >
            <Input
              dir="ltr"
              inputMode="numeric"
              maxLength={10}
              {...form.register("receiver_postal_code")}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="پلاک"
              error={form.formState.errors.receiver_building_number?.message}
            >
              <Input {...form.register("receiver_building_number")} />
            </FormField>
            <FormField
              label="واحد"
              error={form.formState.errors.receiver_unit?.message}
            >
              <Input {...form.register("receiver_unit")} />
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <FormField
              label="نشانی کامل"
              error={form.formState.errors.receiver_address?.message}
            >
              <Textarea
                rows={4}
                placeholder="خیابان، کوچه و سایر توضیحات"
                {...form.register("receiver_address")}
              />
            </FormField>
          </div>
          <div className="flex justify-end gap-2 border-t pt-4 sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saveAddress.isPending}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={saveAddress.isPending}
              className="bg-brand-primary hover:bg-brand-primary-focus"
            >
              {saveAddress.isPending ? "در حال ذخیره..." : "ذخیره آدرس"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  );
}
