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
import { useRouter } from "next/navigation";
import { validateUsername } from "@/lib/validators";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/app/_components/ui/input-otp";
import { createData } from "@/core/http-service";
import { toast } from "sonner";
import { useAuth } from "@/stores/user.store";

type Steps = "CHECK" | "PASSWORD" | "OTP";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [step, setStep] = useState<Steps>("CHECK");
  const router = useRouter();
  const { updateSession } = useAuth();

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-center text-2xl font-bold">
            ورود به حساب کاربری
          </CardTitle>
          <p className="mt-2 text-sm text-gray-600">
            {step === "CHECK" && "شماره موبایل یا ایمیل خود را وارد کنید"}
            {step === "OTP" && "کد تایید ارسال شده را وارد کنید"}
            {step === "PASSWORD" && "رمز عبور خود را وارد کنید"}
          </p>
        </CardHeader>

        <CardContent>
          {step === "CHECK" && (
            <StepCheck
              username={username}
              setUsername={setUsername}
              step={step}
              setStep={setStep}
              router={router}
              updateSession={updateSession}
            />
          )}
          {step === "PASSWORD" && (
            <StepPassword
              username={username}
              setUsername={setUsername}
              step={step}
              setStep={setStep}
              router={router}
              updateSession={updateSession}
            />
          )}
          {step === "OTP" && (
            <StepOTP
              username={username}
              setUsername={setUsername}
              step={step}
              setStep={setStep}
              router={router}
              updateSession={updateSession}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface StepsProps {
  username: string;
  setUsername: (value: string) => void;
  step: Steps;
  setStep: (value: Steps) => void;
  router: ReturnType<typeof useRouter>;
  updateSession: () => Promise<void>;
}

function StepCheck({ username, setUsername, setStep }: StepsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      toast.error("شماره موبایل وارد شده صحیح نمی‌باشد");
      return;
    }

    setIsLoading(true);

    try {
      const response = await createData<
        { username: string },
        { section: Steps }
      >("/api/users/authenticate/check/", { username });

      if (response.success) {
        setStep(response.data.section);
      } else {
        toast.error("خطایی رخ داد. لطفا دوباره تلاش کنید");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("خطایی در ورود رخ داد. لطفا دوباره تلاش کنید");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="block text-right">
            شماره موبایل یا ایمیل
          </Label>
          <Input
            id="phone"
            type="text"
            placeholder="09123456789 | example@gmail.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            dir="ltr"
            className="text-center"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "در حال ارسال..." : "ارسال کد تایید"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          با ورود به سایت، شما شرایط و قوانین را می‌پذیرید
        </p>
      </div>
    </>
  );
}
function StepPassword({ username, router, updateSession }: StepsProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await createData<
        { username: string; password: string },
        { access: string; refresh: string }
      >("/api/users/authenticate/password/", { username, password });

      if (response.success) {
        await updateSession();

        toast.success("ورود موفق");
        router.push("/");
      } else {
        toast.error("رمز عبور اشتباه است");
      }
    } catch (error) {
      console.error("Password error:", error);
      toast.error("خطایی رخ داد. لطفا دوباره تلاش کنید");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password" className="block text-right">
            رمز عبور
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="رمز عبور خود را وارد کنید"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "در حال ورود..." : "ورود"}
        </Button>
      </form>
    </>
  );
}
function StepOTP({ username, router, updateSession }: StepsProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOtpComplete = async (value: string) => {
    setOtp(value);
    if (value.length === 4) {
      setIsLoading(true);
      try {
        const response = await createData<
          { username: string; otp: string },
          { access: string; refresh: string }
        >("/api/users/authenticate/otp/", { username, otp: value });

        if (response.success) {
          await updateSession();

          toast.success("ورود موفق");
          router.push("/");
        } else {
          setOtp("");
          toast.error("کد تایید اشتباه است");
        }
      } catch (error) {
        console.error("OTP error:", error);
        setOtp("");
        toast.error("خطایی رخ داد. لطفا دوباره تلاش کنید");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="block text-right">کد تایید</Label>
          <div dir="ltr" className="flex justify-center">
            <InputOTP
              maxLength={4}
              value={otp}
              onChange={handleOtpComplete}
              disabled={isLoading}
            >
              <InputOTPGroup className="*:data-[active=true]:border-brand-primary *:data-[active=true]:ring-brand-primary/20 gap-5 *:size-12 *:!rounded-xl *:border *:!shadow-none">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
        {isLoading && <p className="text-center text-sm">در حال بررسی...</p>}
      </div>
    </>
  );
}
