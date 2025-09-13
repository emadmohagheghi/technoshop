"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Truck, Clock, Star } from "lucide-react";
import {
  useShippingStore,
  type ShippingAddress,
} from "@/stores/shipping.store";

export default function ShippingPage() {
  const {
    selectedShippingId,
    shippingAddress,
    shippingOptions,
    setSelectedShipping,
    setShippingAddress,
    setShippingOptions,
  } = useShippingStore();

  const [address, setAddress] = useState<ShippingAddress>(shippingAddress);

  // Initialize shipping options with icons
  useEffect(() => {
    const optionsWithIcons = [
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
    setShippingOptions(optionsWithIcons);
  }, [setShippingOptions]);

  // Update store when address changes
  useEffect(() => {
    setShippingAddress(address);
  }, [address, setShippingAddress]);

  return (
      <div className="space-y-6">
        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات ارسال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="fullName">نام و نام خانوادگی</Label>
                <Input
                  id="fullName"
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="نام کامل خود را وارد کنید"
                />
              </div>
              <div>
                <Label htmlFor="phone">شماره تماس</Label>
                <Input
                  id="phone"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="09123456789"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="city">شهر</Label>
                <Input
                  id="city"
                  value={address.city}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  placeholder="تهران"
                />
              </div>
              <div>
                <Label htmlFor="postalCode">کد پستی</Label>
                <Input
                  id="postalCode"
                  value={address.postalCode}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      postalCode: e.target.value,
                    }))
                  }
                  placeholder="1234567890"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">آدرس کامل</Label>
              <Textarea
                id="address"
                value={address.address}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setAddress((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="آدرس کامل خود را وارد کنید..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Options */}
        <Card>
          <CardHeader>
            <CardTitle>نحوه ارسال</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedShippingId}
              onValueChange={setSelectedShipping}
            >
              <div className="space-y-4">
                {shippingOptions.map((option) => {
                  // Get icon based on option id
                  const getIcon = (id: string) => {
                    switch (id) {
                      case "standard":
                        return <Truck className="h-5 w-5" />;
                      case "express":
                        return <Clock className="h-5 w-5" />;
                      case "premium":
                        return <Star className="h-5 w-5" />;
                      default:
                        return <Truck className="h-5 w-5" />;
                    }
                  };

                  return (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2 space-x-reverse"
                    >
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label
                        htmlFor={option.id}
                        className="hover:bg-muted/50 flex flex-1 cursor-pointer items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-3">
                          {getIcon(option.id)}
                          <div>
                            <div className="font-medium">{option.name}</div>
                            <div className="text-muted-foreground text-sm">
                              {option.description}
                            </div>
                          </div>
                        </div>
                        <div className="text-left">
                          {option.price === 0 ? (
                            <span className="font-medium text-green-600">
                              رایگان
                            </span>
                          ) : (
                            <span className="font-medium">
                              {option.price.toLocaleString()} تومان
                            </span>
                          )}
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
  );
}
