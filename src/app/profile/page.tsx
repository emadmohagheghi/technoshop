"use client";

import { useAuth } from "@/stores/user.store";

export default function ProfilePage() {
  const { updateSession, isLoading, user , logout} = useAuth();
  console.log(user);

  return (
    <div className="min-h-screen">
      {isLoading ? (
        "Loading..."
      ) : user ? (
        <div>
          <p>User is logged in</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        "User is not logged in"
      )}
    </div>
  );
}
