"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import { User, UserEdit } from "iconsax-reactjs";
import { useUserStore } from "@/stores/user.store";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileTabs() {
  const { user } = useUserStore();
  const params = useParams();

  const [currentTab, setCurrentTab] = useState<string>("account");

  // همگام‌سازی فقط وقتی slug تغییر می‌کنه
  useEffect(() => {
    setCurrentTab((params?.slug as string) || "account");
  }, [params?.slug]);

  return (
    <div>
      <Tabs
        dir="rtl"
        className="flex-row"
        value={currentTab}
        onValueChange={setCurrentTab} // کنترل داخلی
      >
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
              <UserEdit className="size-6" />
              سفارشات
            </Link>
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <p>Account settings go here.</p>
        </TabsContent>
        <TabsContent value="orders">
          <p>Order history goes here.</p>
        </TabsContent>
        <TabsContent value="settings">
          <p>Profile settings go here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
