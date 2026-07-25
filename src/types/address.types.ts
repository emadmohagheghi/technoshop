import * as v from "valibot";

export type UserAddress = {
  id: number;
  title: string;
  is_default: boolean;
  receiver_name: string;
  receiver_family: string;
  receiver_phone: string;
  receiver_national_code: string;
  receiver_province: string;
  receiver_city: string;
  receiver_postal_code: string | null;
  receiver_building_number: string | null;
  receiver_unit: string | null;
  receiver_address: string;
};

export type AddressChoices = {
  provinces: string[];
  cities: string[];
};

export const addressSchema = v.object({
  title: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(2, "عنوان آدرس را وارد کنید"),
    v.maxLength(30, "عنوان آدرس حداکثر ۳۰ کاراکتر است"),
  ),
  receiver_name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(2, "نام گیرنده را کامل وارد کنید"),
    v.maxLength(20, "نام گیرنده حداکثر ۲۰ کاراکتر است"),
  ),
  receiver_family: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(2, "نام خانوادگی گیرنده را کامل وارد کنید"),
    v.maxLength(20, "نام خانوادگی حداکثر ۲۰ کاراکتر است"),
  ),
  receiver_phone: v.pipe(
    v.string(),
    v.trim(),
    v.regex(/^09\d{9}$/, "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد"),
  ),
  receiver_national_code: v.pipe(
    v.string(),
    v.trim(),
    v.regex(/^\d{10}$/, "کد ملی باید ۱۰ رقم باشد"),
  ),
  receiver_province: v.pipe(v.string(), v.minLength(1, "استان را انتخاب کنید")),
  receiver_city: v.pipe(v.string(), v.minLength(1, "شهر را انتخاب کنید")),
  receiver_postal_code: v.pipe(
    v.string(),
    v.trim(),
    v.regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),
  ),
  receiver_building_number: v.pipe(
    v.string(),
    v.trim(),
    v.maxLength(10, "پلاک حداکثر ۱۰ کاراکتر است"),
  ),
  receiver_unit: v.pipe(
    v.string(),
    v.trim(),
    v.maxLength(4, "واحد حداکثر ۴ کاراکتر است"),
  ),
  receiver_address: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(10, "آدرس باید حداقل ۱۰ کاراکتر باشد"),
    v.maxLength(100, "آدرس حداکثر ۱۰۰ کاراکتر است"),
  ),
});

export type AddressFormData = v.InferInput<typeof addressSchema>;
