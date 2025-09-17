import { ApiError } from "@/types/http-errors.types";
import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiResponseType } from "@/types/response";
import { jwtDecode } from "jwt-decode";

import { errorHandler, networkErrorStrategy } from "./http-error-strategies";

type CustomAxiosRequestConfig = InternalAxiosRequestConfig & {
  skipAuth?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const httpService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Utility functions for JWT
function decodeJWT(token: string) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  try {
    const response = await axios.post(`${API_URL}/api/users/token/refresh/`, {
      refresh,
    });
    const newAccess = response.data.access;
    localStorage.setItem("access", newAccess);
    return newAccess;
  } catch {
    // Refresh failed, clear tokens
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    return null;
  }
}

// Request interceptor
httpService.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    if (config.skipAuth) {
      return config;
    }
    let access = localStorage.getItem("access");
    if (access && isTokenExpired(access)) {
      access = await refreshAccessToken();
    }
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

httpService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response) {
      const statusCode = error?.response?.status;
      if (statusCode >= 400) {
        const errorData: ApiError = error.response?.data;
        errorHandler[statusCode](errorData);
      }
    } else {
      networkErrorStrategy();
    }
  },
);

async function apiBase<T>(
  url: string,
  options?: AxiosRequestConfig & { requireAuth?: boolean },
): Promise<ApiResponseType<T>> {
  const config = {
    ...options,
    requireAuth: options?.requireAuth ?? false,
  };
  if (!config.requireAuth) {
    (config as any).skipAuth = true;
  }
  const response = await httpService(url, config);
  return response.data as ApiResponseType<T>;
}

async function readData<T>(
  url: string,
  requireAuth?: boolean,
  headers?: AxiosRequestHeaders,
): Promise<ApiResponseType<T>> {
  const options: AxiosRequestConfig = {
    headers: headers,
    method: "GET",
  };
  (options as any).requireAuth = requireAuth;
  return await apiBase<T>(url, options);
}

async function createData<TModel, TResult>(
  url: string,
  data: TModel,
  headers?: AxiosRequestHeaders,
  requireAuth?: boolean,
): Promise<ApiResponseType<TResult>> {
  const options: AxiosRequestConfig = {
    method: "POST",
    headers: headers,
    data: JSON.stringify(data),
  };
  (options as any).requireAuth = requireAuth;

  return await apiBase<TResult>(url, options);
}

async function updateData<TModel, TResult>(
  url: string,
  data: TModel,
  headers?: AxiosRequestHeaders,
  requireAuth?: boolean,
): Promise<ApiResponseType<TResult>> {
  const options: AxiosRequestConfig = {
    method: "PUT",
    headers: headers,
    data: JSON.stringify(data),
  };
  (options as any).requireAuth = requireAuth;

  return await apiBase<TResult>(url, options);
}

async function deleteData(
  url: string,
  headers?: AxiosRequestHeaders,
  requireAuth?: boolean,
): Promise<ApiResponseType<void>> {
  const options: AxiosRequestConfig = {
    method: "DELETE",
    headers: headers,
  };
  (options as any).requireAuth = requireAuth;

  return await apiBase(url, options);
}

export { createData, readData, updateData, deleteData };
