import { HeaderType } from '@/types/header.types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type HeaderStore  = HeaderType & {
  setHeaderData: (header: HeaderType) => void;
};

export const useHeaderStore = create<HeaderStore>()(
  devtools((set) => ({
    categories: [],
    brands: [],
    setHeaderData: (header: HeaderType) => {
      set({
        categories: header.categories,
        brands: header.brands,
      });
    },
  }))
);
