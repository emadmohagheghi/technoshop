"use client";
import { TabsContent } from "@/app/_components/ui/tabs";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import UserInformations from "../_components/user-informations";

export default function ProfilePage() {
  const params = useParams();
  const currentTab = (params?.slug as string) || "account";

  if (!["account", "orders", "settings"].includes(currentTab)) {
    notFound();
  }

  return (
    <>
      <TabsContent
        value="account"
        className={cn(
          { hidden: currentTab !== "account" },
          "bg-white rounded-lg p-5 sm:p-10",
        )}
      >
        <UserInformations />
      </TabsContent>
      <TabsContent
        dir="ltr"
        value="orders"
        className={cn(
          { hidden: currentTab !== "orders" },
          "bg-white rounded-lg p-5 sm:p-10",
        )}
      >
        <p>Under construction...</p>
      </TabsContent>
      <TabsContent
        dir="ltr"
        value="settings"
        className={cn(
          { hidden: currentTab !== "settings" },
          "bg-white rounded-lg p-5 sm:p-10",
        )}
      >
        <p>Under construction...</p>
      </TabsContent>
    </>
  );
}
