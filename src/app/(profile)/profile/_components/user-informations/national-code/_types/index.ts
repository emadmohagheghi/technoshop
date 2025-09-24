import * as v from "valibot";
import { national_code } from "@/types/user.types";

// Schema for updating national code
export const NationalCodeUpdateSchema = v.object({
  national_code: v.optional(v.union([national_code, v.literal("")])),
});

export type NationalCodeFormData = v.InferOutput<
  typeof NationalCodeUpdateSchema
>;
