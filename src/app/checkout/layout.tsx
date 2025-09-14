"use client";
import { Steps } from "./_components/steps";

import OrderSummaryWrapper from "./_components/order-summery/order-summary-wrapper";
import { FormProvider, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  shippingAddressSchema,
  ShippingAddressForm,
} from "./shipping/_types/shipping-info.schema";

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const methods = useForm<ShippingAddressForm>({
    resolver: valibotResolver(shippingAddressSchema),
    mode: "onChange",
  });

  return (
    <div className="xs:px-10 container px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">تسویه حساب</h1>
      <Steps />
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <FormProvider {...methods}>
          <div className="col-span-1 lg:col-span-2">{children}</div>
          <div className="relative col-span-1 lg:col-span-1">
            <div className="sticky top-48">
              <OrderSummaryWrapper />
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}
