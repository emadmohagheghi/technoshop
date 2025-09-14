"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Label } from "@/app/_components/ui/label";
import { useState } from "react";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation for Iranian phone numbers
    const phoneRegex = /^09[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert("شماره موبایل وارد شده صحیح نمی‌باشد");
      return;
    }

    setIsLoading(true);

    try {
      // Here you would typically send the phone number to your API
      console.log("Phone number:", phoneNumber);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Handle success - redirect to verification page or home
      alert("کد تایید به شماره شما ارسال شد");
    } catch (error) {
      console.error("Login error:", error);
      alert("خطایی در ورود رخ داد. لطفا دوباره تلاش کنید");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-center text-2xl font-bold">
            ورود به حساب کاربری
          </CardTitle>
          <p className="mt-2 text-sm text-gray-600">
            شماره موبایل خود را وارد کنید
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="block text-right">
                شماره موبایل
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="09123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                dir="ltr"
                className="text-center"
                maxLength={11}
                required
              />
              <p className="text-right text-xs text-gray-500">
                مثال: 09123456789
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || phoneNumber.length < 11}
            >
              {isLoading ? "در حال ارسال..." : "ارسال کد تایید"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              با ورود به سایت، شما شرایط و قوانین را می‌پذیرید
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
