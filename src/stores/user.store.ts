import { create } from "zustand";
import { readData, logoutUser } from "@/core/http-service";

interface UserInfo {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  is_superuser: boolean;
  is_active?: boolean;
  date_joined?: string;
  last_login?: string;
}

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
    const response = await readData<{
      message: string;
      user_id: number;
      username: string;
      is_authenticated: boolean;
      is_superuser: boolean;
    }>("/api/users/test-auth/");

    if (response.success && response.data.is_authenticated) {
      const data = response.data;
      const user: UserInfo = {
        id: data.user_id,
        username: data.username,
        is_superuser: data.is_superuser,
      };

      return {
        user,
        status: "authenticated" as AuthStatus,
      };
    }

    return {
      user: null,
      status: "unauthenticated" as AuthStatus,
    };
  } catch (error) {
    return {
      user: null,
      status: "unauthenticated" as AuthStatus,
    };
  }
};

export const useUserStore = create<SessionState>((set, get) => ({
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
    } catch (error) {
      console.error("Failed to update session:", error);
      set({
        user: null,
        status: "unauthenticated" as AuthStatus,
      });
    }
  },

  logout: async () => {
    try {
      await logoutUser();

      set({
        user: null,
        status: "unauthenticated" as AuthStatus,
      });
    } catch (error) {
      console.error("Logout failed:", error);
      set({
        user: null,
        status: "unauthenticated" as AuthStatus,
      });
    }
  },
}));

if (typeof window !== "undefined") {
  useUserStore.getState().updateSession();
}

export const useAuth = () => {
  const { user, status, updateSession, logout } = useUserStore();

  return {
    user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    updateSession,
    logout,
    refreshAuth: updateSession,
  };
};
