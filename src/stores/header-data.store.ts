import { HeaderType } from "@/types/header.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { readData } from "@/core/http-service";

type HeaderStore = HeaderType & {
  setHeaderData: (header: HeaderType) => void;
  fetchHeaderData: () => Promise<void>;
};

const getHeaderData = async () => {
  const data = await readData<HeaderType>(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/content/header/data/",
  );
  return data.data;
};

export const useHeaderStore = create<HeaderStore>()(
  devtools((set, get) => ({
    categories: [],
    brands: [],
    fetchHeaderData: async () => {
      if (get().categories.length > 0) {
        return;
      }

      try {
        const data = await getHeaderData();
        set({
          categories: data.categories,
          brands: data.brands,
        });
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    },
  })),
);

if (typeof window !== "undefined") {
  useHeaderStore.getState().fetchHeaderData();
}
