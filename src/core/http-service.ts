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

httpService.interceptors.request.use(
  async (config) => {
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
    if (error?.response) {
      const statusCode = error?.response?.status;
      if (statusCode >= 400) {
        const errorData: ApiError = error.response?.data;
        (errorHandler[statusCode] ?? errorHandler[500])(errorData);
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
  const response = await httpService(url, options);
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

async function patchData<TModel, TResult>(
  url: string,
  data: TModel,
  headers?: AxiosRequestHeaders,
): Promise<ApiResponseType<TResult>> {
  const options: AxiosRequestConfig = {
    method: "PATCH",
    headers: headers,
    data: JSON.stringify(data),
  };

  return await apiBase<TResult>(url, options);
}

async function deleteData<TResult = void>(
  url: string,
  data?: unknown,
  headers?: AxiosRequestHeaders,
): Promise<ApiResponseType<TResult>> {
  const options: AxiosRequestConfig = {
    method: "DELETE",
    headers: headers,
    data: data === undefined ? undefined : JSON.stringify(data),
  };

  return await apiBase<TResult>(url, options);
}

// Logout function - فقط Cookie authentication
async function logoutUser(): Promise<void> {
  try {
    await httpService.post("/api/users/logout/");
  } catch (error) {
    console.warn("Logout request failed:", error);
  }
}

export { createData, readData, updateData, patchData, deleteData, logoutUser };
