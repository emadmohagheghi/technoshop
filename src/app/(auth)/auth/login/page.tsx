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

const LOGIN_SESSION_ERROR =
  "\u0646\u0634\u0633\u062a \u0648\u0631\u0648\u062f \u062a\u0623\u06cc\u06cc\u062f \u0646\u0634\u062f. \u062f\u0648\u0628\u0627\u0631\u0647 \u062a\u0644\u0627\u0634 \u06a9\u0646\u06cc\u062f.";

type Steps = "CHECK" | "PASSWORD" | "OTP";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [step, setStep] = useState<Steps>("CHECK");
  const router = useRouter();
  const { updateSession } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19 7-7-7-7" />
                <path d="M19 12H5" />
              </svg>
            </Button>
            <div className="flex-1" />
          </div>
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
  updateSession: () => Promise<boolean>;
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
          <span className="block text-left">
            use:{" "}
            <span
              className="cursor-pointer"
              onClick={() => setUsername("09000000000")}
            >
              09000000000
            </span>
          </span>
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
        const isAuthenticated = await updateSession();
        if (!isAuthenticated) {
          toast.error(LOGIN_SESSION_ERROR);
          return;
        }

        toast.success("ورود موفق");
        router.replace("/");
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
          <span className="block text-left">
            use:{" "}
            <span
              className="cursor-pointer"
              onClick={() => setPassword("123456789")}
            >
              123456789
            </span>
          </span>
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
          const isAuthenticated = await updateSession();
          if (!isAuthenticated) {
            toast.error(LOGIN_SESSION_ERROR);
            return;
          }

          toast.success("ورود موفق");
          router.replace("/");
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
