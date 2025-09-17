import { readData } from "@/core/http-service";
import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  is_superuser: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  authMethod: "JWT" | "Cookie" | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    authMethod: null,
  });

  const checkAuthStatus = async () => {
    try {
      // تلاش برای دریافت اطلاعات کاربر - backend خودش تشخیص می‌دهد JWT یا Cookie
      const response = await readData<{
        user_id: number;
        username: string;
        authentication_method: string;
        is_authenticated: boolean;
        is_superuser: boolean;
      }>("api/users/request/current/");

      if (response.success && response.data.is_authenticated) {
        setAuthState({
          isAuthenticated: true,
          user: {
            id: response.data.user_id,
            username: response.data.username,
            is_superuser: response.data.is_superuser,
          },
          isLoading: false,
          authMethod: response.data.authentication_method === "JWT Token" ? "JWT" : "Cookie",
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          authMethod: null,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        authMethod: null,
      });
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const refreshAuth = () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    checkAuthStatus();
  };

  return {
    ...authState,
    refreshAuth,
  };
}
