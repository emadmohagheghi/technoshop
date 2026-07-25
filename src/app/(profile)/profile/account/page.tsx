"use client";

import { Badge } from "@/app/_components/ui/badge";
import { useUserStore } from "@/stores/user.store";
import { Lock, ShieldTick } from "iconsax-reactjs";
import ContactFieldCard from "../_components/contact-field-card";
import ProfilePageHeader from "../_components/profile-page-header";
import UserInformations from "../_components/user-informations";

export default function AccountPage() {
  const user = useUserStore((state) => state.user);

  return (
    <div className="space-y-5">
      <section className="rounded-xl border bg-white p-4 sm:p-6">
        <ProfilePageHeader
          title="اطلاعات فردی"
          description="اطلاعات هویتی و راه‌های ارتباطی حساب خود را مدیریت کنید."
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <Badge
            variant="outline"
            className={
              user?.is_verify
                ? "bg-success-content border-0 px-3 py-1.5 text-green-700"
                : "bg-warning-content text-warning-focus border-0 px-3 py-1.5"
            }
          >
            <ShieldTick size={15} />
            {user?.is_verify ? "حساب تأیید شده" : "حساب نیازمند تأیید"}
          </Badge>
          <Badge
            variant="outline"
            className="border-0 bg-gray-100 px-3 py-1.5 text-gray-700"
          >
            <Lock size={15} />
            {user?.has_password ? "رمز عبور فعال" : "ورود با رمز یک‌بارمصرف"}
          </Badge>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4 sm:p-6">
        <h2 className="font-bold text-gray-900">اطلاعات هویتی</h2>
        <p className="mt-1 text-sm text-gray-600">
          نام و کد ملی باید با مشخصات گیرنده سفارش مطابقت داشته باشد.
        </p>
        <div className="mt-5">
          <UserInformations />
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4 sm:p-6">
        <h2 className="font-bold text-gray-900">راه‌های ارتباطی</h2>
        <p className="mt-1 text-sm text-gray-600">
          تغییر موبایل یا ایمیل با کد یک‌بارمصرف تأیید می‌شود.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <ContactFieldCard
            type="phone"
            value={user?.phone ?? null}
            verified={Boolean(user?.is_verify)}
          />
          <ContactFieldCard
            type="email"
            value={user?.email ?? null}
            verified={Boolean(user?.email)}
          />
        </div>
      </section>
    </div>
  );
}
