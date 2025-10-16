import * as v from "valibot";
import { first_name, last_name } from "@/types/user.types";

// Schema for updating user details
export const UserUpdateSchema = v.object({
  first_name,
  last_name,
});

export type UserUpdateFormData = v.InferOutput<typeof UserUpdateSchema>;
