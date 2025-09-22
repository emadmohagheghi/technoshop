import {
  full_name,
  phone,
  city,
  postalCode,
  address,
} from "@/types/user.types";
import * as v from "valibot";

// Schema validation با valibot
export const shippingAddressSchema = v.object({
  fullName: full_name,
  phone: phone,
  city: city,
  postalCode: postalCode,
  address: address,
});

export type ShippingAddressForm = v.InferInput<typeof shippingAddressSchema>;
