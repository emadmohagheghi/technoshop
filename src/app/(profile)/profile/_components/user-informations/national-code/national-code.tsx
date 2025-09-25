"use client";

import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";

import { useUserStore } from "@/stores/user.store";
import type { UpdateNationalCodeRequest } from "@/services/users-service";
import { cn } from "@/lib/utils";
import { Edit, User } from "iconsax-reactjs";
import {
  NationalCodeUpdateSchema,
  type NationalCodeFormData,
} from "../national-code/_types";

export function NationalCode() {
  const updateNationalCode = useUserStore((state) => state.updateNationalCode);
  const user = useUserStore((state) => state.user);
  const status = useUserStore((state) => state.status);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<NationalCodeFormData>({
    resolver: valibotResolver(NationalCodeUpdateSchema),
    defaultValues: {
      national_code: user?.national_code || "",
    },
  });

  // Reset form when dialog opens or user changes
  const resetForm = () => {
    form.reset({
      national_code: user?.national_code || "",
    });
  };

  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      resetForm();
    } else {
      form.clearErrors();
    }
    setIsOpen(open);
  };

  const onSubmit = async (data: NationalCodeFormData) => {
    setIsLoading(true);
    try {
      // Transform the data to match API expectations
      const apiData: UpdateNationalCodeRequest = {
        national_code:
          data.national_code && data.national_code.trim() !== ""
            ? data.national_code
            : null,
      };

      const result = await updateNationalCode(apiData);

      if (result.success) {
        toast.success("کد ملی شما با موفقیت به‌روزرسانی شد");
        setIsOpen(false);
        form.reset(data); // Reset form with new values
      } else {
        toast.error(result.message || "خطا در به‌روزرسانی کد ملی");
      }
    } catch (error) {
      toast.error("خطا در به‌روزرسانی کد ملی");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-secondary flex items-center gap-2 rounded-lg px-4 py-6",
      )}
    >
      <User className="size-6" />
      <div className="flex-1">
        <p className="mb-1 text-sm text-gray-600">کد ملی</p>
        <p
          className={cn("text-xl font-medium", {
            "h-7 w-32 animate-pulse rounded-full bg-gray-300":
              status === "loading",
          })}
        >
          {!(status === "loading") && (user?.national_code || "نامشخص")}
        </p>
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Edit className="text-brand-primary hover:text-brand-primary-focus size-6 cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader dir="ltr">
            <DialogTitle className="sr-only">ویرایش کد ملی</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="national_code">کد ملی</Label>
                <Input
                  id="national_code"
                  {...form.register("national_code")}
                  placeholder="کد ملی خود را وارد کنید"
                  maxLength={10}
                />
                {form.formState.errors.national_code && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.national_code.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button" disabled={isLoading}>
                  انصراف
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-brand-primary hover:bg-brand-primary-focus"
                disabled={isLoading}
              >
                {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NationalCode;
