import { create } from "zustand";
import { readData } from "@/core/http-service";
import { UserInfo } from "@/types/user.types";

type AuthStatus = "authenticated" | "unauthenticated" | "loading";

interface SessionState {
  user: UserInfo | null;
  status: AuthStatus;
  clearSession: () => void;
  updateSession: () => void;
}

const fetchCurrentUser = async () => {
  try {
    const response = await readData<UserInfo>(
      "http://localhost:8000/api/users/request/current",
      true,
    );

    if (response.success) {
      const data = response.data;
      return data
        ? { user: data, status: "authenticated" as AuthStatus }
        : { user: null, status: "unauthenticated" as AuthStatus };
    }

    return { user: null, status: "unauthenticated" as AuthStatus };
  } catch {
    return { user: null, status: "unauthenticated" as AuthStatus };
  }
};

export const useUserStore = create<SessionState>((set) => ({
  user: null,
  status: "loading" as AuthStatus,
  clearSession: () =>
    set({ user: null, status: "unauthenticated" as AuthStatus }),
  updateSession: async () => {
    const { user, status } = await fetchCurrentUser();
    set({ user, status });
  },
}));

if (typeof window !== "undefined") {
  useUserStore.getState().updateSession();
}
