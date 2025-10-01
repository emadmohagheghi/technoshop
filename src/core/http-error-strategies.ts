import {
  ApiError,
  BadRequestError,
  NetworkError,
  NotFoundError,
  UnhandledException,
  ValidationError,
} from "@/types/http-errors.types";

export type ApiErrorHandler = (errorData: ApiError) => void;

export const badRequestErrorStrategy: ApiErrorHandler = (errorData) => {
  throw {
    ...errorData,
  } as BadRequestError;
};

export const validationErrorStrategy: ApiErrorHandler = (errorData) => {
  throw { ...errorData } as ValidationError;
};

export const notFoundErrorStrategy: ApiErrorHandler = (errorData) => {
  throw { ...errorData, detail: "سرویس مورد نظر یافت نشد" } as NotFoundError;
};


export const unhandledExceptionStrategy: ApiErrorHandler = (errorData) => {
  throw { ...errorData, detail: "خطای سرور" } as UnhandledException;
};

export const networkErrorStrategy = () => {
  throw { detail: "خطای شبکه" } as NetworkError;
};

export const errorHandler: Record<number, ApiErrorHandler> = {
  400: (errorData) =>
    (errorData.errors ? validationErrorStrategy : badRequestErrorStrategy)(
      errorData,
    ),
  404: notFoundErrorStrategy, // یافت نشد
  500: unhandledExceptionStrategy, // خطای سرور
  502: unhandledExceptionStrategy, // Bad Gateway
  503: unhandledExceptionStrategy, // Service Unavailable
};
