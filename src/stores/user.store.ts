import { create } from "zustand";
import { readData, logoutUser } from "@/core/http-service";
import { UserInfo } from "@/types/user.types";

type AuthStatus = "authenticated" | "unauthenticated" | "loading";

interface SessionState {
  user: UserInfo | null;
  status: AuthStatus;
  clearSession: () => void;
  updateSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const fetchCurrentUser = async () => {
  try {
    const response = await readData<UserInfo>("/api/users/request/current/");

    if (response.data) {
      return {
        user: response.data,
        status: "authenticated" as AuthStatus,
      };
    }

    return {
      user: null,
      status: "unauthenticated" as AuthStatus,
    };
  } catch {
    return {
      user: null,
      status: "unauthenticated" as AuthStatus,
    };
  }
};

export const useUserStore = create<SessionState>((set) => ({
  user: null,
  status: "loading" as AuthStatus,

  clearSession: () =>
    set({
      user: null,
      status: "unauthenticated" as AuthStatus,
    }),

  updateSession: async () => {
    try {
      const { user, status } = await fetchCurrentUser();
      set({ user, status });
    } catch {
      set({
        user: null,
        status: "unauthenticated" as AuthStatus,
      });
    }
  },

  logout: async () => {
    try {
      // Call backend logout برای پاک کردن cookies
      await logoutUser();

      // Clear store state
      set({
        user: null,
        status: "unauthenticated" as AuthStatus,
      });
    } catch (error) {
      set({
        user: null,
        status: "unauthenticated" as AuthStatus,
      });
    }
  },
}));

// Initialize session on client side
if (typeof window !== "undefined") {
  useUserStore.getState().updateSession();
}

// Hook برای راحتی استفاده
export const useAuth = () => {
  const { user, status, updateSession, logout } = useUserStore();

  return {
    user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    updateSession,
    logout,
  };
};
