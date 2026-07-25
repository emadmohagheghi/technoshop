"use client";

import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  confirmEmailChange,
  confirmPhoneChange,
  requestEmailChange,
  requestPhoneChange,
} from "@/services/users-service";
import { useUserStore } from "@/stores/user.store";
import { Edit2, Sms, Call } from "iconsax-reactjs";
import { useState } from "react";
import { toast } from "sonner";

type ContactType = "phone" | "email";

export default function ContactFieldCard({
  type,
  value,
  verified,
}: {
  type: ContactType;
  value: string | null;
  verified: boolean;
}) {
  const updateSession = useUserStore((state) => state.updateSession);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"contact" | "otp">("contact");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [pending, setPending] = useState(false);
  const isPhone = type === "phone";
  const Icon = isPhone ? Call : Sms;
  const label = isPhone ? "شماره موبایل" : "ایمیل";

  const reset = () => {
    setStep("contact");
    setContact("");
    setOtp("");
    setPending(false);
  };

  const validateContact = () => {
    if (isPhone && !/^09\d{9}$/.test(contact)) {
      toast.error("شماره موبایل معتبر وارد کنید");
      return false;
    }
    if (!isPhone && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      toast.error("ایمیل معتبر وارد کنید");
      return false;
    }
    if (contact === value) {
      toast.error(`${label} جدید با مقدار فعلی یکسان است`);
      return false;
    }
    return true;
  };

  const requestOtp = async () => {
    if (!validateContact()) return;
    setPending(true);
    try {
      if (isPhone) {
        await requestPhoneChange(contact);
      } else {
        await requestEmailChange(contact);
      }
      setStep("otp");
      toast.success(`کد تأیید برای ${contact} ارسال شد`);
    } catch {
      toast.error("ارسال کد تأیید ناموفق بود");
    } finally {
      setPending(false);
    }
  };

  const confirmOtp = async () => {
    if (otp.trim().length < 4) {
      toast.error("کد تأیید را کامل وارد کنید");
      return;
    }
    setPending(true);
    try {
      if (isPhone) {
        await confirmPhoneChange(contact, otp);
      } else {
        await confirmEmailChange(contact, otp);
      }
      await updateSession();
      toast.success(`${label} با موفقیت به‌روزرسانی شد`);
      setOpen(false);
      reset();
    } catch {
      toast.error("کد تأیید صحیح نیست یا منقضی شده است");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-white p-4">
      <div className="bg-brand-primary-content text-brand-primary grid size-11 shrink-0 place-items-center rounded-lg">
        <Icon size={22} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-gray-500">{label}</p>
          <Badge
            variant="outline"
            className={
              verified
                ? "bg-success-content border-0 text-green-700"
                : "border-0 bg-gray-100 text-gray-600"
            }
          >
            {verified ? "تأیید شده" : "تأیید نشده"}
          </Badge>
        </div>
        <p className="mt-1 truncate font-medium text-gray-900">
          {value || "ثبت نشده"}
        </p>
      </div>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) reset();
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`ویرایش ${label}`}
            className="text-brand-primary"
          >
            <Edit2 size={19} />
          </Button>
        </DialogTrigger>
        <DialogContent dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle>
              {value ? `تغییر ${label}` : `افزودن ${label}`}
            </DialogTitle>
            <DialogDescription>
              {step === "contact"
                ? `${label} جدید را وارد کنید تا کد تأیید ارسال شود.`
                : `کد ارسال‌شده به ${contact} را وارد کنید.`}
            </DialogDescription>
          </DialogHeader>

          {step === "contact" ? (
            <div className="space-y-2">
              <Label htmlFor={`new-${type}`}>{label} جدید</Label>
              <Input
                id={`new-${type}`}
                type={isPhone ? "tel" : "email"}
                dir="ltr"
                value={contact}
                onChange={(event) => setContact(event.target.value.trim())}
                placeholder={isPhone ? "09123456789" : "name@example.com"}
                maxLength={isPhone ? 11 : 254}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor={`${type}-otp`}>کد تأیید</Label>
              <Input
                id={`${type}-otp`}
                inputMode="numeric"
                dir="ltr"
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="text-center text-lg tracking-[0.4em]"
                autoFocus
              />
              <Button
                type="button"
                variant="link"
                className="h-auto px-0"
                disabled={pending}
                onClick={() => void requestOtp()}
              >
                ارسال دوباره کد
              </Button>
            </div>
          )}

          <DialogFooter className="gap-2">
            {step === "otp" && (
              <Button
                variant="outline"
                onClick={() => {
                  setStep("contact");
                  setOtp("");
                }}
                disabled={pending}
              >
                ویرایش {label}
              </Button>
            )}
            <Button
              disabled={pending}
              className="bg-brand-primary hover:bg-brand-primary-focus"
              onClick={() =>
                void (step === "contact" ? requestOtp() : confirmOtp())
              }
            >
              {pending
                ? "در حال انجام..."
                : step === "contact"
                  ? "ارسال کد"
                  : "تأیید و ذخیره"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
