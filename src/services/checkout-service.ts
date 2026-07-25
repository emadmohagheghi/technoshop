import { createData, patchData, readData } from "@/core/http-service";
import type {
  CheckoutConfirmation,
  CheckoutSelection,
  CheckoutState,
} from "@/types/checkout.types";

const CHECKOUT_URL = "/api/order/checkout/";

export async function getCheckout(): Promise<CheckoutState> {
  const response = await readData<CheckoutState>(CHECKOUT_URL);
  return response.data;
}

export async function updateCheckout(selection: CheckoutSelection) {
  const response = await patchData<CheckoutSelection, CheckoutState>(
    CHECKOUT_URL,
    selection,
  );
  return response.data;
}

export async function confirmCheckout(): Promise<CheckoutConfirmation> {
  const response = await createData<
    Record<string, never>,
    CheckoutConfirmation
  >(`${CHECKOUT_URL}confirm/`, {});
  return response.data;
}
