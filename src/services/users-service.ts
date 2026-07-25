import { createData, deleteData, updateData } from "@/core/http-service";
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

export async function requestPhoneChange(phone: string) {
  return createData<{ phone: string; otp_usage: "VERIFY" }, null>(
    "/api/users/edit/phone/request/",
    { phone, otp_usage: "VERIFY" },
  );
}

export async function confirmPhoneChange(phone: string, otp: string) {
  return createData<{ phone: string; otp: string }, null>(
    "/api/users/edit/phone/confirm/",
    { phone, otp },
  );
}

export async function requestEmailChange(email: string) {
  return createData<{ email: string; otp_usage: "VERIFY" }, null>(
    "/api/users/edit/email/request/",
    { email, otp_usage: "VERIFY" },
  );
}

export async function confirmEmailChange(email: string, otp: string) {
  return createData<{ email: string; otp: string }, null>(
    "/api/users/edit/email/confirm/",
    { email, otp },
  );
}

export type UpdatePasswordRequest = {
  current_password: string;
  password: string;
  confirm_password: string;
};

export async function updatePassword(data: UpdatePasswordRequest) {
  return updateData<UpdatePasswordRequest, null>(
    "/api/users/edit/password/",
    data,
  );
}

export async function clearSearchHistory() {
  return deleteData("/api/users/search-history/");
}
