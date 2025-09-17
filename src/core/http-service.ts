import { ApiError } from "@/types/http-errors.types";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { ApiResponseType } from "@/types/response";

import { errorHandler, networkErrorStrategy } from "./http-error-strategies";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const httpService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor - فقط Cookie authentication
httpService.interceptors.request.use(
  async (config) => {
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

      // برای 401 (غیر مجاز) - وضعیت عادی است، خطا نیاندازیم
      if (statusCode === 401) {
        // یک response موفق شبیه‌سازی کنیم با اطلاعات عدم احراز هویت
        return {
          success: false,
          data: {
            is_authenticated: false,
            message: "User not authenticated",
          },
        };
      }

      if (statusCode >= 400) {
        const errorData: ApiError = error.response?.data;

        // بررسی وجود handler برای status code
        const handler = errorHandler[statusCode];
        if (handler) {
          try {
            handler(errorData);
          } catch (handlerError) {
            // اگر handler خطا داد، error اصلی را برگردان
            return Promise.reject(error);
          }
        } else {
          // fallback برای status code های تعریف نشده
          console.warn(`No handler defined for status code: ${statusCode}`);
        }
      }
    } else {
      networkErrorStrategy();
    }
    return Promise.reject(error);
  },
);

async function apiBase<T>(
  url: string,
  options?: AxiosRequestConfig,
): Promise<ApiResponseType<T>> {
  const config = {
    ...options,
  };
  const response = await httpService(url, config);
  return response.data as ApiResponseType<T>;
}

async function readData<T>(
  url: string,
  headers?: AxiosRequestHeaders,
): Promise<ApiResponseType<T>> {
  const options: AxiosRequestConfig = {
    headers: headers,
    method: "GET",
  };
  return await apiBase<T>(url, options);
}

async function createData<TModel, TResult>(
  url: string,
  data: TModel,
  headers?: AxiosRequestHeaders,
): Promise<ApiResponseType<TResult>> {
  const options: AxiosRequestConfig = {
    method: "POST",
    headers: headers,
    data: JSON.stringify(data),
  };
  return await apiBase<TResult>(url, options);
}

async function updateData<TModel, TResult>(
  url: string,
  data: TModel,
  headers?: AxiosRequestHeaders,
): Promise<ApiResponseType<TResult>> {
  const options: AxiosRequestConfig = {
    method: "PUT",
    headers: headers,
    data: JSON.stringify(data),
  };

  return await apiBase<TResult>(url, options);
}

async function deleteData(
  url: string,
  headers?: AxiosRequestHeaders,
): Promise<ApiResponseType<void>> {
  const options: AxiosRequestConfig = {
    method: "DELETE",
    headers: headers,
  };

  return await apiBase(url, options);
}

async function logoutUser(): Promise<void> {
  try {
    await httpService.post("/api/auth/admin/logout/");
  } catch (error) {
    console.warn("Logout request failed:", error);
  }
}

export { createData, readData, updateData, deleteData, logoutUser };
