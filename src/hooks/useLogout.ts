import { logoutUser } from "@/core/http-service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    try {
      await logoutUser();
      toast.success("خروج موفق");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("خطا در خروج");
    }
  };

  return { logout };
}