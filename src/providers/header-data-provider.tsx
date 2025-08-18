"use client";
import { useEffect } from "react";
import { useHeaderStore } from "@/stores/header-data.store";
import { readData } from "@/core/http-service";
import { HeaderType } from "@/types/header.types";

export const getHeaderData = async () => {
  const data = await readData<HeaderType>(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/content/header/data/",
  );
  return data.data;
};

export default function GetHeaderData() {
  const setHeaderData = useHeaderStore((state) => state.setHeaderData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHeaderData();
        setHeaderData(data);
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    };
    fetchData();
  }, [setHeaderData]);

  return null;
}
