"use client";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { ToggleTheme } from "@/app/_components/ui/theme-toggle";
import { clearRecentProducts } from "@/services/recent-products-service";
import { clearSearchHistory, updatePassword } from "@/services/users-service";
import { useUserStore } from "@/stores/user.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft2,
  Clock,
  Lock,
  Logout,
  Moon,
  SearchNormal,
  ShieldSecurity,
} from "iconsax-reactjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "../_components/confirm-dialog";
import ProfilePageHeader from "../_components/profile-page-header";

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, updateSession, logout } = useUserStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordMutation = useMutation({
    mutationFn: () =>
      updatePassword({
        current_password: currentPassword,
        password,
        confirm_password: confirmPassword,
      }),
    onSuccess: async () => {
      await updateSession();
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      toast.success(
        user?.has_password
          ? "رمز عبور با موفقیت تغییر کرد"
          : "رمز عبور با موفقیت فعال شد",
      );
    },
    onError: () =>
      toast.error("تغییر رمز عبور ناموفق بود؛ اطلاعات را بررسی کنید"),
  });
  const clearSearch = useMutation({
    mutationFn: clearSearchHistory,
    onSuccess: async () => {
      await updateSession();
      toast.success("تاریخچه جست‌وجو پاک شد");
    },
    onError: () => toast.error("پاک کردن تاریخچه جست‌وجو ناموفق بود"),
  });
  const clearRecent = useMutation({
    mutationFn: clearRecentProducts,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile", "recent"] });
      toast.success("بازدیدهای اخیر پاک شدند");
    },
    onError: () => toast.error("پاک کردن بازدیدهای اخیر ناموفق بود"),
  });

  const submitPassword = () => {
    if (password.length < 8) {
      toast.error("رمز عبور جدید باید حداقل ۸ کاراکتر باشد");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("تکرار رمز عبور با رمز جدید یکسان نیست");
      return;
    }
    passwordMutation.mutate();
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <div className="space-y-5">
      <section className="rounded-xl border bg-white p-4 sm:p-6">
        <ProfilePageHeader
          title="تنظیمات و امنیت"
          description="امنیت حساب، ظاهر برنامه و داده‌های ذخیره‌شده را مدیریت کنید."
        />
      </section>

      <section className="rounded-xl border bg-white p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="bg-brand-primary-content text-brand-primary grid size-11 place-items-center rounded-lg">
            <ShieldSecurity size={23} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">امنیت حساب</h2>
            <p className="mt-1 text-sm text-gray-600">
              {user?.has_password
                ? "رمز عبور حساب خود را تغییر دهید."
                : "برای ورود سریع‌تر، یک رمز عبور برای حساب فعال کنید."}
            </p>
          </div>
        </div>

        <div className="mt-5 grid max-w-2xl gap-4">
          {user?.has_password && (
            <div className="space-y-2">
              <Label htmlFor="current-password">رمز عبور فعلی</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">رمز عبور جدید</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">تکرار رمز عبور</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>
          <div>
            <Button
              disabled={passwordMutation.isPending}
              className="bg-brand-primary hover:bg-brand-primary-focus"
              onClick={submitPassword}
            >
              <Lock size={18} />
              {passwordMutation.isPending
                ? "در حال ذخیره..."
                : user?.has_password
                  ? "تغییر رمز عبور"
                  : "فعال کردن رمز عبور"}
            </Button>
          </div>
        </div>

        <Link
          href="/profile/account"
          className="hover:border-brand-primary mt-5 flex items-center justify-between rounded-lg border p-4 text-sm text-gray-700 transition-colors"
        >
          <span>تغییر شماره موبایل یا ایمیل</span>
          <ArrowLeft2 size={18} />
        </Link>
      </section>

      <section className="rounded-xl border bg-white p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-lg bg-gray-100 text-gray-700">
              <Moon size={22} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">ظاهر برنامه</h2>
              <p className="mt-1 text-sm text-gray-600">
                بین حالت روشن و تیره جابه‌جا شوید.
              </p>
            </div>
          </div>
          <ToggleTheme />
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4 sm:p-6">
        <h2 className="font-bold text-gray-900">داده‌ها و حریم خصوصی</h2>
        <div className="mt-4 divide-y">
          <SettingAction
            icon={<SearchNormal size={20} />}
            title="تاریخچه جست‌وجو"
            description={`${(user?.search_histories?.length ?? 0).toLocaleString("fa-IR")} عبارت ذخیره شده`}
            action={
              <ConfirmDialog
                title="پاک کردن تاریخچه جست‌وجو"
                description="عبارت‌های جست‌وجوشده از حساب شما پاک می‌شوند."
                confirmLabel="پاک کردن"
                pending={clearSearch.isPending}
                onConfirm={() => clearSearch.mutateAsync()}
                trigger={
                  <Button variant="outline" size="sm">
                    پاک کردن
                  </Button>
                }
              />
            }
          />
          <SettingAction
            icon={<Clock size={20} />}
            title="بازدیدهای اخیر"
            description="حذف سابقه محصولاتی که مشاهده کرده‌اید"
            action={
              <ConfirmDialog
                title="پاک کردن بازدیدهای اخیر"
                description="تمام محصولات مشاهده‌شده از سابقه حساب حذف می‌شوند."
                confirmLabel="پاک کردن"
                pending={clearRecent.isPending}
                onConfirm={() => clearRecent.mutateAsync()}
                trigger={
                  <Button variant="outline" size="sm">
                    پاک کردن
                  </Button>
                }
              />
            }
          />
          <SettingAction
            icon={<Logout size={20} />}
            title="خروج از حساب"
            description="جلسه فعلی شما در این دستگاه پایان می‌یابد"
            action={
              <ConfirmDialog
                title="خروج از حساب"
                description="برای ورود دوباره باید شماره موبایل و رمز یا کد یک‌بارمصرف را وارد کنید."
                confirmLabel="خروج"
                onConfirm={handleLogout}
                trigger={
                  <Button variant="destructive" size="sm">
                    خروج
                  </Button>
                }
              />
            }
          />
        </div>
      </section>
    </div>
  );
}

function SettingAction({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-gray-100 text-gray-600">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      {action}
    </div>
  );
}
