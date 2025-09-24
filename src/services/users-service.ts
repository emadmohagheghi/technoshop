import { updateData } from "@/core/http-service";
import { ApiResponseType } from "@/types/response";

export type UpdateUserDetailsRequest = {
  first_name: string;
  last_name: string;
  national_code?: string | null;
};

export type UpdateNationalCodeRequest = {
  national_code?: string | null;
};

export async function updateUserDetails(
  data: UpdateUserDetailsRequest,
): Promise<ApiResponseType<null>> {
  return await updateData<UpdateUserDetailsRequest, null>(
    "/api/users/edit/detail/",
    data,
  );
}

export async function updateNationalCode(
  data: UpdateNationalCodeRequest,
): Promise<ApiResponseType<null>> {
  return await updateData<UpdateNationalCodeRequest, null>(
    "/api/users/edit/detail/",
    data,
  );
}
