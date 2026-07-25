import {
  createData,
  deleteData,
  readData,
  updateData,
} from "@/core/http-service";
import {
  AddressChoices,
  AddressFormData,
  UserAddress,
} from "@/types/address.types";

const ADDRESS_URL = "/api/address/";

export async function getAddresses(): Promise<UserAddress[]> {
  const response = await readData<UserAddress[]>(ADDRESS_URL);
  return response.data;
}

export async function getAddressChoices(): Promise<AddressChoices> {
  const response = await readData<AddressChoices>("/api/address/choices/");
  return response.data;
}

export async function createAddress(data: AddressFormData) {
  return createData<AddressFormData, UserAddress>(ADDRESS_URL, data);
}

export async function updateAddress(id: number, data: AddressFormData) {
  return updateData<AddressFormData, UserAddress>(`${ADDRESS_URL}${id}/`, data);
}

export async function deleteAddress(id: number) {
  return deleteData(`${ADDRESS_URL}${id}/`);
}

export async function setDefaultAddress(id: number) {
  return createData<Record<string, never>, UserAddress>(
    `${ADDRESS_URL}${id}/default/`,
    {},
  );
}
