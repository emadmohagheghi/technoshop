import { readData } from "@/core/http-service";
import type { ProfileDashboardData } from "@/types/profile.types";

export async function getProfileDashboard(): Promise<ProfileDashboardData> {
  const response = await readData<ProfileDashboardData>(
    "/api/users/profile/dashboard/",
  );
  return response.data;
}
