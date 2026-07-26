"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { getApiErrorMessage } from "@/core/http-error-message";
import { createData } from "@/core/http-service";
import { validateUsername } from "@/lib/validators";
import { useAuth } from "@/stores/user.store";

const LOGIN_SESSION_ERROR = "نشست ورود تأیید نشد. دوباره تلاش کنید.";

type LoginStep = "CHECK" | "PASSWORD" | "OTP";

type LoginCheckData = {
  section: LoginStep;
  retry_after?: number;
  expires_in?: number;
  otp_length?: number;
};

type OTPConfig = {
  retryAfter: number;
  expiresIn: number;
  length: number;
};

const DEFAULT_OTP_CONFIG: OTPConfig = {
  retryAfter: 0,
  expiresIn: 240,
  length: 6,
};

function getLoginRedirectPath() {
  if (typeof window === "undefined") return "/";
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

function toOTPConfig(data: LoginCheckData): OTPConfig {
  return {
    retryAfter: data.retry_after ?? DEFAULT_OTP_CONFIG.retryAfter,
    expiresIn: data.expires_in ?? DEFAULT_OTP_CONFIG.expiresIn,
    length: data.otp_length ?? DEFAULT_OTP_CONFIG.length,
  };
}

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [step, setStep] = useState<LoginStep>("CHECK");
  const [otpConfig, setOtpConfig] = useState(DEFAULT_OTP_CONFIG);
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
              aria-label="بازگشت به فروشگاه"
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
          <CardTitle className="text-2xl font-bold">
            ورود به حساب کاربری
          </CardTitle>
          <p className="mt-2 text-sm text-gray-600">
            {step === "CHECK" && "شماره موبایل یا ایمیل خود را وارد کنید"}
            {step === "OTP" && `کد تأیید ارسال‌شده به ${username} را وارد کنید`}
            {step === "PASSWORD" && "رمز عبور خود را وارد کنید"}
          </p>
        </CardHeader>

        <CardContent>
          {step === "CHECK" && (
            <StepCheck
              username={username}
              setUsername={setUsername}
              setStep={setStep}
              setOtpConfig={setOtpConfig}
            />
          )}
          {step === "PASSWORD" && (
            <StepPassword
              username={username}
              setStep={setStep}
              router={router}
              updateSession={updateSession}
            />
          )}
          {step === "OTP" && (
            <StepOTP
              username={username}
              setStep={setStep}
              router={router}
              updateSession={updateSession}
              otpConfig={otpConfig}
              setOtpConfig={setOtpConfig}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

type CommonStepProps = {
  username: string;
  setStep: (value: LoginStep) => void;
};

type SessionStepProps = CommonStepProps & {
  router: ReturnType<typeof useRouter>;
  updateSession: () => Promise<boolean>;
};

function StepCheck({
  username,
  setUsername,
  setStep,
  setOtpConfig,
}: CommonStepProps & {
  setUsername: (value: string) => void;
  setOtpConfig: (value: OTPConfig) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedUsername = username.trim();

    if (!validateUsername(normalizedUsername)) {
      toast.error("شماره موبایل یا ایمیل واردشده معتبر نیست");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createData<{ username: string }, LoginCheckData>(
        "/api/users/authenticate/check/",
        { username: normalizedUsername },
      );

      if (!response.success || !response.data) {
        toast.error(response.message || "امکان ادامه فرایند ورود وجود ندارد");
        return;
      }

      setUsername(normalizedUsername);
      if (response.data.section === "OTP") {
        setOtpConfig(toOTPConfig(response.data));
      }
      setStep(response.data.section);
    } catch (error) {
      console.error("Login check failed:", error);
      toast.error(
        getApiErrorMessage(error, "امکان ادامه فرایند ورود وجود ندارد"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username" className="block text-right">
            شماره موبایل یا ایمیل
          </Label>
          <Input
            id="username"
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
          {isLoading ? "در حال بررسی..." : "ادامه"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-gray-500">
        با ورود به سایت، شرایط و قوانین تکنوشاپ را می‌پذیرید.
      </p>
    </>
  );
}

function StepPassword({
  username,
  setStep,
  router,
  updateSession,
}: SessionStepProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await createData<
        { username: string; password: string },
        null
      >("/api/users/authenticate/password/", { username, password });

      if (!response.success) {
        toast.error(response.message || "رمز عبور اشتباه است");
        return;
      }

      const isAuthenticated = await updateSession();
      if (!isAuthenticated) {
        toast.error(LOGIN_SESSION_ERROR);
        return;
      }

      toast.success("با موفقیت وارد شدید");
      router.replace(getLoginRedirectPath());
    } catch (error) {
      console.error("Password login failed:", error);
      toast.error(getApiErrorMessage(error, "رمز عبور اشتباه است"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="password" className="block text-right">
          رمز عبور
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="رمز عبور خود را وارد کنید"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "در حال ورود..." : "ورود"}
      </Button>
      <Button asChild variant="link" className="w-full">
        <Link
          href={`/auth/forgot-password?username=${encodeURIComponent(username)}`}
        >
          رمز عبور را فراموش کرده‌ام
        </Link>
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => setStep("CHECK")}
        disabled={isLoading}
      >
        اصلاح شماره موبایل یا ایمیل
      </Button>
    </form>
  );
}

function StepOTP({
  username,
  setStep,
  router,
  updateSession,
  otpConfig,
  setOtpConfig,
}: SessionStepProps & {
  otpConfig: OTPConfig;
  setOtpConfig: (value: OTPConfig) => void;
}) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [retryAfter, setRetryAfter] = useState(otpConfig.retryAfter);

  useEffect(() => {
    if (retryAfter <= 0) return;
    const timer = window.setInterval(() => {
      setRetryAfter((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [retryAfter]);

  const verifyOTP = async (value: string) => {
    setOtp(value);
    if (value.length !== otpConfig.length || isLoading) return;

    setIsLoading(true);
    try {
      const response = await createData<
        { username: string; otp: string },
        null
      >("/api/users/authenticate/otp/", { username, otp: value });

      if (!response.success) {
        setOtp("");
        toast.error(response.message || "کد تأیید اشتباه است");
        return;
      }

      const isAuthenticated = await updateSession();
      if (!isAuthenticated) {
        toast.error(LOGIN_SESSION_ERROR);
        return;
      }

      toast.success("با موفقیت وارد شدید");
      router.replace(getLoginRedirectPath());
    } catch (error) {
      console.error("OTP login failed:", error);
      setOtp("");
      toast.error(getApiErrorMessage(error, "کد تأیید اشتباه است"));
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (retryAfter > 0 || isResending) return;

    setIsResending(true);
    try {
      const response = await createData<{ username: string }, LoginCheckData>(
        "/api/users/authenticate/check/",
        { username },
      );
      if (
        !response.success ||
        !response.data ||
        response.data.section !== "OTP"
      ) {
        toast.error(response.message || "ارسال مجدد کد ممکن نشد");
        return;
      }

      const nextConfig = toOTPConfig(response.data);
      setOtpConfig(nextConfig);
      setRetryAfter(nextConfig.retryAfter);
      setOtp("");
      toast.success("کد تأیید دوباره ارسال شد");
    } catch (error) {
      console.error("OTP resend failed:", error);
      toast.error(getApiErrorMessage(error, "ارسال مجدد کد ممکن نشد"));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Label className="block text-right">کد تأیید</Label>
        <div dir="ltr" className="flex justify-center">
          <InputOTP
            maxLength={otpConfig.length}
            value={otp}
            onChange={verifyOTP}
            disabled={isLoading}
            inputMode="numeric"
          >
            <InputOTPGroup className="*:data-[active=true]:border-brand-primary *:data-[active=true]:ring-brand-primary/20 gap-2 *:size-10 *:!rounded-xl *:border *:!shadow-none sm:gap-3 sm:*:size-12">
              {Array.from({ length: otpConfig.length }, (_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      {isLoading && <p className="text-center text-sm">در حال بررسی کد...</p>}

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={resendOTP}
          disabled={retryAfter > 0 || isResending || isLoading}
        >
          {isResending
            ? "در حال ارسال..."
            : retryAfter > 0
              ? `ارسال مجدد تا ${formatCountdown(retryAfter)}`
              : "ارسال مجدد کد"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setStep("CHECK")}
          disabled={isLoading || isResending}
        >
          اصلاح شماره موبایل یا ایمیل
        </Button>
      </div>
    </div>
  );
}
