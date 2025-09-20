"use client";
import { useFormContext } from "react-hook-form";
import {
  ShippingAddressForm,
} from "../_types/shipping-info.schema";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";

export default function ShippingForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<ShippingAddressForm>();

  return (
    <form
      className="grid grid-cols-1 lg:grid-cols-2 gap-3 *:col-span-1"
      onSubmit={handleSubmit((data) => console.log(data))}
    >
      <div className="">
        <Input {...register("fullName")} placeholder="نام و نام خانوادگی" />
        <span className="text-error text-sm">{errors.fullName?.message}</span>
      </div>
      <div className="">
        <Input {...register("phone")} placeholder="شماره تلفن" />
        <span className="text-error text-sm">{errors.phone?.message}</span>
      </div>
      <div>
        <Input {...register("city")} placeholder="شهر" />
        <span className="text-error text-sm">{errors.city?.message}</span>
      </div>
      <div>
        <Input {...register("postalCode")} placeholder="کد پستی" />
        <span className="text-error text-sm">{errors.postalCode?.message}</span>
      </div>
      <div className="!col-span-2">
        <Textarea
          className="min-h-35"
          {...register("address")}
          placeholder="آدرس"
        />
        <span className="text-error text-sm">{errors.address?.message}</span>
      </div>
    </form>
  );
}
