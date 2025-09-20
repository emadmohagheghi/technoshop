import { ApiError } from "@/types/http-errors.types";
import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiResponseType } from "@/types/response";

import { errorHandler, networkErrorStrategy } from "./http-error-strategies";

type CustomAxiosRequestConfig = InternalAxiosRequestConfig & {
  skipAuth?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";


const httpService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

httpService.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    if (config.skipAuth) {
      return config;
    }

    config.withCredentials = true;

    return config;
  },
  (error) => Promise.reject(error),
);

httpService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error?.response) {
      const statusCode = error?.response?.status;
      if (statusCode >= 400) {
        const errorData: ApiError = error.response?.data;
        errorHandler[statusCode](errorData);
      }
    } else {
      console.error("🔴 Network Error:", error.message);
      networkErrorStrategy();
    }

    return Promise.reject(error);
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

// Logout function - فقط Cookie authentication
async function logoutUser(): Promise<void> {
  try {
    // فقط logout endpoint را صدا می‌زنیم، backend خودش cookie را حذف می‌کند
    await httpService.post("/api/auth/admin/logout/");
  } catch (error) {
    console.warn("Logout request failed:", error);
  }
  // دیگر نیازی به localStorage نیست
}

export { createData, readData, updateData, deleteData, logoutUser };
