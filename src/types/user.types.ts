import * as v from "valibot";

export type UserInfo = {
  full_name: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string;
  national_code: string | null;
  is_superuser: boolean;
  is_verify: boolean;
  has_password: boolean;
  search_histories: [
    {
      id: number;
      search: string;
    },
  ][];
};

export const first_name = v.pipe(
  v.string(),
  v.minLength(2, "نام باید حداقل 2 کاراکتر باشد"),
  v.maxLength(20, "نام نمی‌تواند بیش از 20 کاراکتر باشد"),
  v.trim(),
);

export const last_name = v.pipe(
  v.string(),
  v.minLength(2, "نام خانوادگی باید حداقل 2 کاراکتر باشد"),
  v.maxLength(20, "نام خانوادگی نمی‌تواند بیش از 20 کاراکتر باشد"),
  v.trim(),
);

export const full_name = v.pipe(
  v.string(),
  v.minLength(5, "نام و نام خانوادگی باید حداقل 5 کاراکتر باشد"),
  v.maxLength(31, "نام و نام خانوادگی نمی‌تواند بیش از 31 کاراکتر باشد"),
  v.trim(),
);

export const email = v.pipe(v.string(), v.email("ایمیل نامعتبر است"), v.trim());

export const phone = v.pipe(
  v.string(),
  v.regex(/^(\+98|0)?9\d{9}$/, "شماره تماس باید با 09 شروع شده و 11 رقم باشد"),
  v.trim(),
);

export const city = v.pipe(
  v.string(),
  v.minLength(2, "نام شهر باید حداقل 2 کاراکتر باشد"),
  v.maxLength(10, "نام شهر نمی‌تواند بیش از 10 کاراکتر باشد"),
  v.trim(),
);
export const postalCode = v.pipe(
  v.string(),
  v.regex(/^\d{10}$/, "کد پستی باید 10 رقم باشد"),
  v.trim(),
);
export const address = v.pipe(
  v.string(),
  v.minLength(10, "آدرس باید حداقل 10 کاراکتر باشد"),
  v.maxLength(100, "آدرس نمی‌تواند بیش از 100 کاراکتر باشد"),
  v.trim(),
);

export const national_code = v.pipe(
  v.string(),
  v.regex(/^\d{10}$/, "کد ملی باید 10 رقم باشد"),
  v.trim(),
);
