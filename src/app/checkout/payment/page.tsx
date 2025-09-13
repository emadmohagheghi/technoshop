"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import { Label } from "@/app/_components/ui/label";
import { CreditCard, Wallet, Building } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";

const paymentMethods = [
  {
    id: "card",
    name: "پرداخت با کارت بانکی",
    description: "پرداخت آنلاین با کارت‌های عضو شتاب",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: "wallet",
    name: "کیف پول دیجیتال",
    description: "پرداخت از طریق کیف پول الکترونیکی",
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    id: "bank",
    name: "انتقال بانکی",
    description: "واریز مستقیم به حساب بانکی",
    icon: <Building className="h-5 w-5" />,
  },
];

export default function PaymentPage() {
  const [selectedPayment, setSelectedPayment] = useState("card");


  const selectedMethod = paymentMethods.find(
    (method) => method.id === selectedPayment,
  );

  return (
    <div className="space-y-6">
      <div className="gap-6">
        {/* Payment Methods */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>روش پرداخت</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedPayment}
                onValueChange={setSelectedPayment}
              >
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center space-x-2 space-x-reverse"
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label
                        htmlFor={method.id}
                        className="hover:bg-muted/50 flex flex-1 cursor-pointer items-center gap-3 rounded-lg border p-4"
                      >
                        {method.icon}
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-muted-foreground text-sm">
                            {method.description}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>جزئیات پرداخت</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  {selectedMethod?.icon}
                  <span className="font-medium">{selectedMethod?.name}</span>
                </div>
                <p className="text-muted-foreground mb-4 text-sm">
                  {selectedMethod?.description}
                </p>

                <div className="rounded border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    🔒 پرداخت شما از طریق درگاه امن بانکی انجام خواهد شد و تمامی
                    اطلاعات محرمانه شما محافظت می‌شود.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
