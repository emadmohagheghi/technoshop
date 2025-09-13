import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
}

interface ShippingStore {
  selectedShippingId: string;
  shippingAddress: ShippingAddress;
  shippingOptions: ShippingOption[];

  // Actions
  setSelectedShipping: (shippingId: string) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setShippingOptions: (options: ShippingOption[]) => void;

  // Getters
  getSelectedShipping: () => ShippingOption | undefined;
  getShippingCost: () => number;
}

const defaultShippingOptions: ShippingOption[] = [
  {
    id: "standard",
    name: "ارسال عادی",
    description: "تحویل در ۳ تا ۵ روز کاری",
    price: 0,
  },
  {
    id: "express",
    name: "ارسال سریع",
    description: "تحویل در ۱ تا ۲ روز کاری",
    price: 50000,
  },
  {
    id: "premium",
    name: "ارسال ویژه",
    description: "تحویل در همان روز",
    price: 120000,
  },
];

const defaultAddress: ShippingAddress = {
  fullName: "",
  phone: "",
  city: "",
  address: "",
  postalCode: "",
};

export const useShippingStore = create<ShippingStore>()(
  persist(
    (set, get) => ({
      selectedShippingId: "standard",
      shippingAddress: defaultAddress,
      shippingOptions: defaultShippingOptions,

      setSelectedShipping: (shippingId) => {
        set({ selectedShippingId: shippingId });
      },

      setShippingAddress: (address) => {
        set({ shippingAddress: address });
      },

      setShippingOptions: (options) => {
        set({ shippingOptions: options });
      },

      getSelectedShipping: () => {
        const { selectedShippingId, shippingOptions } = get();
        return shippingOptions.find(
          (option) => option.id === selectedShippingId,
        );
      },

      getShippingCost: () => {
        const selectedShipping = get().getSelectedShipping();
        return selectedShipping ? selectedShipping.price : 0;
      },
    }),
    {
      name: "shipping-storage",
      partialize: (state) => ({
        selectedShippingId: state.selectedShippingId,
        shippingAddress: state.shippingAddress,
      }),
      skipHydration: true,
    },
  ),
);
