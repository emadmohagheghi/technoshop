import * as v from "valibot";

// Schema validation با valibot
export const shippingAddressSchema = v.object({
  fullName: v.pipe(
    v.string(),
    v.minLength(2, "نام و نام خانوادگی باید حداقل 2 کاراکتر باشد"),
    v.maxLength(20, "نام و نام خانوادگی نمی‌تواند بیش از 20 کاراکتر باشد"),
    v.trim(),
  ),
  phone: v.pipe(
    v.string(),
    v.regex(/^09\d{9}$/, "شماره تماس باید با 09 شروع شده و 11 رقم باشد"),
    v.trim(),
  ),
  city: v.pipe(
    v.string(),
    v.minLength(2, "نام شهر باید حداقل 2 کاراکتر باشد"),
    v.maxLength(10, "نام شهر نمی‌تواند بیش از 10 کاراکتر باشد"),
    v.trim(),
  ),
  postalCode: v.pipe(
    v.string(),
    v.regex(/^\d{10}$/, "کد پستی باید 10 رقم باشد"),
    v.trim(),
  ),
  address: v.pipe(
    v.string(),
    v.minLength(10, "آدرس باید حداقل 10 کاراکتر باشد"),
    v.maxLength(100, "آدرس نمی‌تواند بیش از 100 کاراکتر باشد"),
    v.trim(),
  ),
});

export type ShippingAddressForm = v.InferInput<typeof shippingAddressSchema>;
