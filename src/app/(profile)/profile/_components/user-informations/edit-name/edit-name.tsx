"use client";

import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useState } from "react";
import { toast } from "sonner";
import { Edit, User } from "iconsax-reactjs";

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
import type { UpdateUserDetailsRequest } from "@/services/users-service";
import { UserUpdateSchema, type UserUpdateFormData } from "./_types";
import { cn } from "@/lib/utils";

export default function EditName() {
  const updateUserInfo = useUserStore((state) => state.updateUserInfo);
  const user = useUserStore((state) => state.user);
  const status = useUserStore((state) => state.status);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<UserUpdateFormData>({
    resolver: valibotResolver(UserUpdateSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
    },
  });

  const resetForm = () => {
    form.reset({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      resetForm();
    } else {
      form.clearErrors();
    }
    setIsOpen(open);
  };

  const onSubmit = async (data: UserUpdateFormData) => {
    setIsLoading(true);
    try {
      const apiData: UpdateUserDetailsRequest = {
        first_name: data.first_name,
        last_name: data.last_name,
        national_code: user?.national_code || null,
      };

      const result = await updateUserInfo(apiData);
      if (result.success) {
        toast.success("اطلاعات شما با موفقیت به‌روزرسانی شد");
        setIsOpen(false);
        form.reset(data);
      } else {
        toast.error(result.message || "خطا در به‌روزرسانی اطلاعات");
      }
    } catch (error) {
      toast.error("خطا در به‌روزرسانی اطلاعات");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-secondary flex items-center gap-2 rounded-lg px-4 py-6">
      <User className="size-6" />
      <div className="flex-1">
        <p className="mb-1 text-sm text-gray-600">نام و نام خانوادگی</p>
        <p
          className={cn("text-lg font-medium", {
            "h-7 w-40 animate-pulse rounded-full bg-gray-300": status === "loading",
          })}
        >
          {!(status === "loading") && (user?.full_name || "نامشخص")}
        </p>
      </div>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Edit className="text-brand-primary hover:text-brand-primary-focus size-6 cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader dir="ltr">
            <DialogTitle className="sr-only">ویرایش اطلاعات کاربر</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="first_name">نام</Label>
                <Input
                  id="first_name"
                  {...form.register("first_name")}
                  placeholder="نام خود را وارد کنید"
                />
                {form.formState.errors.first_name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="last_name">نام خانوادگی</Label>
                <Input
                  id="last_name"
                  {...form.register("last_name")}
                  placeholder="نام خانوادگی خود را وارد کنید"
                />
                {form.formState.errors.last_name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.last_name.message}
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
              <Button type="submit" className="bg-brand-primary hover:bg-brand-primary-focus" disabled={isLoading}>
                {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
