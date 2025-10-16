import { create } from "zustand";
import { readData, logoutUser } from "@/core/http-service";
import { UserInfo } from "@/types/user.types";
import {
  updateUserDetails,
  UpdateUserDetailsRequest,
  updateNationalCode,
  UpdateNationalCodeRequest,
} from "@/services/users-service";

type AuthStatus = "authenticated" | "unauthenticated" | "loading";

interface SessionState {
  user: UserInfo | null;
  status: AuthStatus;
  clearSession: () => void;
  updateSession: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserInfo: (
    data: UpdateUserDetailsRequest,
  ) => Promise<{ success: boolean; message?: string }>;
  updateNationalCode: (
    data: UpdateNationalCodeRequest,
  ) => Promise<{ success: boolean; message?: string }>;
}

const fetchCurrentUser = async () => {
  try {
    const response = await readData<UserInfo>("/api/users/request/current/");

    if (response.success) {
      const user = response.data;

      return {
        user,
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

  updateUserInfo: async (data: UpdateUserDetailsRequest) => {
    try {
      const response = await updateUserDetails(data);

      if (response.success) {
        // Update the local user state with new data
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              first_name: data.first_name,
              last_name: data.last_name,
              full_name: `${data.first_name} ${data.last_name}`,
              national_code: data.national_code || currentUser.national_code,
            },
          });
        }
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error("Update user info failed:", error);
      return { success: false, message: "خطا در به‌روزرسانی اطلاعات" };
    }
  },

  updateNationalCode: async (data: UpdateNationalCodeRequest) => {
    try {
      const response = await updateNationalCode(data);

      if (response.success) {
        // Update the local user state with new national code
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              national_code: data.national_code || null,
            },
          });
        }
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error("Update national code failed:", error);
      return { success: false, message: "خطا در به‌روزرسانی کد ملی" };
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
