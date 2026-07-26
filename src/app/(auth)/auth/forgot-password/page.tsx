"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/app/_components/ui/input-otp";
import { Label } from "@/app/_components/ui/label";
import { createData } from "@/core/http-service";
import { validateUsername } from "@/lib/validators";

type ForgotPasswordStep = "IDENTIFIER" | "OTP" | "PASSWORD" | "SUCCESS";

type OTPMetadata = {
  retry_after: number;
  expires_in: number;
  otp_length: number;
};

type ResetTokenData = {
  token: string;
};

const DEFAULT_OTP_METADATA: OTPMetadata = {
  retry_after: 60,
  expires_in: 240,
  otp_length: 6,
};

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null) return fallback;
  const value = error as { message?: unknown; detail?: unknown };
  if (typeof value.message === "string" && value.message) return value.message;
  if (typeof value.detail === "string" && value.detail) return value.detail;
  return fallback;
}

function isStrongPassword(password: string) {
  return (
    password.length >= 8 &&
    password.length <= 18 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  );
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<ForgotPasswordStep>("IDENTIFIER");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpMetadata, setOtpMetadata] = useState(DEFAULT_OTP_METADATA);
  const [retryAfter, setRetryAfter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialUsername = new URLSearchParams(window.location.search).get(
      "username",
    );
    if (initialUsername && validateUsername(initialUsername)) {
      setUsername(initialUsername);
    }
  }, []);

  useEffect(() => {
    if (retryAfter <= 0) return;
    const timer = window.setInterval(() => {
      setRetryAfter((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [retryAfter]);

  const requestCode = async (isResend = false) => {
    const normalizedUsername = username.trim();
    if (!validateUsername(normalizedUsername)) {
      toast.error("شماره موبایل یا ایمیل واردشده معتبر نیست");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createData<{ username: string }, OTPMetadata>(
        "/api/users/forgot/password/check/",
        { username: normalizedUsername },
      );
      const metadata = response.data ?? DEFAULT_OTP_METADATA;
      setUsername(normalizedUsername);
      setOtpMetadata(metadata);
      setRetryAfter(metadata.retry_after);
      setOtp("");
      setStep("OTP");
      toast.success(
        isResend
          ? "کد بازیابی دوباره ارسال شد"
          : response.message || "کد بازیابی ارسال شد",
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "ارسال کد بازیابی ممکن نشد"));
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (event: React.FormEvent) => {
    event.preventDefault();
    if (otp.length !== otpMetadata.otp_length) {
      toast.error("کد بازیابی را کامل وارد کنید");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createData<
        { username: string; otp: string },
        ResetTokenData
      >("/api/users/forgot/password/otp/", { username, otp });
      if (!response.data?.token) {
        toast.error("تأیید کد بازیابی ممکن نشد");
        return;
      }
      setToken(response.data.token);
      setStep("PASSWORD");
    } catch (error) {
      setOtp("");
      toast.error(getErrorMessage(error, "کد بازیابی اشتباه یا منقضی شده است"));
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isStrongPassword(password)) {
      toast.error(
        "رمز عبور باید ۸ تا ۱۸ کاراکتر و شامل حروف بزرگ، کوچک و عدد باشد",
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createData<
        {
          username: string;
          token: string;
          password: string;
          confirm_password: string;
        },
        null
      >("/api/users/forgot/password/reset/", {
        username,
        token,
        password,
        confirm_password: confirmPassword,
      });
      setStep("SUCCESS");
      toast.success(response.message || "رمز عبور جدید ثبت شد");
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "لینک بازیابی منقضی شده است؛ فرایند را دوباره انجام دهید",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const restart = () => {
    setStep("IDENTIFIER");
    setOtp("");
    setToken("");
    setPassword("");
    setConfirmPassword("");
    setRetryAfter(0);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {step === "SUCCESS" ? "رمز عبور تغییر کرد" : "بازیابی رمز عبور"}
          </CardTitle>
          <p className="mt-2 text-sm text-gray-600">
            {step === "IDENTIFIER" &&
              "شماره موبایل یا ایمیل حساب خود را وارد کنید"}
            {step === "OTP" &&
              `کد بازیابی ارسال‌شده به ${username} را وارد کنید`}
            {step === "PASSWORD" && "یک رمز عبور امن برای حساب خود انتخاب کنید"}
            {step === "SUCCESS" &&
              "اکنون می‌توانید با رمز عبور جدید وارد حساب شوید"}
          </p>
        </CardHeader>

        <CardContent>
          {step === "IDENTIFIER" && (
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                void requestCode();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="forgot-username" className="block text-right">
                  شماره موبایل یا ایمیل
                </Label>
                <Input
                  id="forgot-username"
                  type="text"
                  inputMode="email"
                  autoComplete="username"
                  placeholder="09123456789 یا example@gmail.com"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  dir="ltr"
                  className="text-center"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "در حال ارسال..." : "ارسال کد بازیابی"}
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/auth/login">بازگشت به صفحه ورود</Link>
              </Button>
            </form>
          )}

          {step === "OTP" && (
            <form className="space-y-5" onSubmit={verifyOTP}>
              <div className="space-y-3">
                <Label className="block text-right">کد بازیابی</Label>
                <div dir="ltr" className="flex justify-center">
                  <InputOTP
                    maxLength={otpMetadata.otp_length}
                    value={otp}
                    onChange={setOtp}
                    disabled={isLoading}
                    inputMode="numeric"
                  >
                    <InputOTPGroup className="*:data-[active=true]:border-brand-primary gap-2 *:size-10 *:!rounded-xl *:border *:!shadow-none sm:gap-3 sm:*:size-12">
                      {Array.from(
                        { length: otpMetadata.otp_length },
                        (_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ),
                      )}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-center text-xs text-gray-500">
                  اعتبار کد حدود {formatCountdown(otpMetadata.expires_in)} است.
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || otp.length !== otpMetadata.otp_length}
              >
                {isLoading ? "در حال بررسی..." : "تأیید کد"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isLoading || retryAfter > 0}
                onClick={() => void requestCode(true)}
              >
                {retryAfter > 0
                  ? `ارسال مجدد تا ${formatCountdown(retryAfter)}`
                  : "ارسال مجدد کد"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled={isLoading}
                onClick={restart}
              >
                اصلاح شماره موبایل یا ایمیل
              </Button>
            </form>
          )}

          {step === "PASSWORD" && (
            <form className="space-y-5" onSubmit={resetPassword}>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="block text-right">
                  رمز عبور جدید
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  maxLength={18}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="block text-right">
                  تکرار رمز عبور جدید
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={8}
                  maxLength={18}
                  required
                />
              </div>
              <p className="text-xs leading-6 text-gray-500">
                رمز عبور باید ۸ تا ۱۸ کاراکتر و شامل حداقل یک حرف بزرگ انگلیسی،
                یک حرف کوچک و یک عدد باشد.
              </p>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "در حال ثبت..." : "ثبت رمز عبور جدید"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled={isLoading}
                onClick={restart}
              >
                شروع دوباره فرایند
              </Button>
            </form>
          )}

          {step === "SUCCESS" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-green-50 p-4 text-center text-sm text-green-700">
                رمز عبور جدید با موفقیت ثبت شد.
              </div>
              <Button asChild className="w-full">
                <Link href="/auth/login">ورود به حساب کاربری</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
