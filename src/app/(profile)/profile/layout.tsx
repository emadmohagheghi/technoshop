"use client";
import { Tabs, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { User, UserEdit, Bag , Setting} from "iconsax-reactjs";
import { useUserStore } from "@/stores/user.store";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense } from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserStore();
  const params = useParams();

  return (
    <div>
      <div className="container py-5">
        <Tabs dir="rtl" className="flex-row min-h-[calc(100vh-215px)]" defaultValue={params?.slug as string}>
          <TabsList
            className="flex w-72 flex-col *:h-fit *:w-full *:justify-start *:py-5.5 *:!text-xl *:!font-medium"
            containerColor="bg-white"
            indicatorColor="bg-brand-primary-content"
          >
            <TabsTrigger
              disabled
              value="user"
              className="text-brand-primary border-brand-primary flex items-center gap-2 border-b-4 !py-4 text-center disabled:opacity-100"
            >
              <div className="grid size-16 place-content-center rounded-full bg-gray-200">
                <User className="size-6" />
              </div>
              <span>
                {user?.phone || (
                  <div className="h-7 w-32 animate-pulse rounded-full bg-gray-300" />
                )}
              </span>
            </TabsTrigger>
            <TabsTrigger value="account" asChild>
              <Link href="/profile/account">
                <UserEdit className="size-6" />
                اطلاعات فردی
              </Link>
            </TabsTrigger>
            <TabsTrigger value="orders" asChild>
              <Link href="/profile/orders">
                <Bag className="size-6" />
                سفارشات
              </Link>
            </TabsTrigger>
            <TabsTrigger value="settings" asChild>
              <Link href="/profile/settings">
                <Setting className="size-6" />
                تنظیمات
              </Link>
            </TabsTrigger>
          </TabsList>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </Tabs>
      </div>
    </div>
  );
}
