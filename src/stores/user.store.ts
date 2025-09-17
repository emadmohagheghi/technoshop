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
    // استفاده از test-auth endpoint برای بررسی authentication
    const response = await readData<{
      message: string;
      user_id: number;
      username: string;
      is_authenticated: boolean;
      is_superuser: boolean;
    }>("/api/users/test-auth/");

    // بررسی اینکه آیا کاربر احراز هویت شده یا خیر
    if (response.data?.is_authenticated === true) {
      const data = response.data;
      const user: UserInfo = {
        full_name: data.username, // استفاده از username به عنوان full_name موقتی
        first_name: "",
        last_name: "",
        email: null,
        phone: "",
        national_code: null,
        is_superuser: data.is_superuser,
        is_verify: true,
        has_password: true,
        search_histories: [],
      };

      return {
        user,
        status: "authenticated" as AuthStatus,
      };
    }

    // اگر کاربر احراز هویت نشده (وضعیت عادی)
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
