import { create } from "zustand";
import { readData, logoutUser } from "@/core/http-service";

// User interface برای store
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
type AuthMethod = "JWT" | "Cookie" | null;

interface SessionState {
  user: UserInfo | null;
  status: AuthStatus;
  authMethod: AuthMethod;
  clearSession: () => void;
  updateSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const fetchCurrentUser = async () => {
  try {
    // استفاده از test-auth endpoint که authentication method را هم برمی‌گرداند
    const response = await readData<{
      message: string;
      user_id: number;
      username: string;
      authentication_method: string;
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

      const authMethod: AuthMethod = data.authentication_method === "JWT Token" ? "JWT" : "Cookie";

      return {
        user,
        status: "authenticated" as AuthStatus,
        authMethod
      };
    }

    return {
      user: null,
      status: "unauthenticated" as AuthStatus,
      authMethod: null
    };
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return {
      user: null,
      status: "unauthenticated" as AuthStatus,
      authMethod: null
    };
  }
};

export const useUserStore = create<SessionState>((set, get) => ({
  user: null,
  status: "loading" as AuthStatus,
  authMethod: null,

  clearSession: () =>
    set({
      user: null,
      status: "unauthenticated" as AuthStatus,
      authMethod: null
    }),

  updateSession: async () => {
    try {
      const { user, status, authMethod } = await fetchCurrentUser();
      set({ user, status, authMethod });
    } catch (error) {
      console.error("Failed to update session:", error);
      set({
        user: null,
        status: "unauthenticated" as AuthStatus,
        authMethod: null
      });
    }
  },

  logout: async () => {
    try {
      // Call backend logout که هم JWT و هم Cookie پاک می‌کند
      await logoutUser();

      // Clear store state
      set({
        user: null,
        status: "unauthenticated" as AuthStatus,
        authMethod: null
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // حتی اگر API call fail شود، local state را پاک کن
      set({
        user: null,
        status: "unauthenticated" as AuthStatus,
        authMethod: null
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
  const { user, status, authMethod, updateSession, logout } = useUserStore();

  return {
    user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    authMethod,
    updateSession,
    logout,
    refreshAuth: updateSession, // alias
  };
};
