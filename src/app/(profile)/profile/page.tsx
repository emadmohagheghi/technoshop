"use client";

import { useAuth } from "@/stores/user.store";

export default function ProfilePage() {
  const { user } = useAuth();

  console.log(user);

  return <div className="h-[calc(100vh-62px)] lg:h-[calc(100vh-175px)] grid place-items-center">Profile Page</div>;
}
