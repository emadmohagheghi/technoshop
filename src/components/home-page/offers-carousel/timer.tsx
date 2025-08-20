"use client";
import { secondsToHHMMSS } from "@/utils/time";
import { useState, useEffect } from "react";

export default function Timer({ initialSeconds }: { initialSeconds: number }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  // تایمر معکوس با استفاده از useEffect
  useEffect(() => {
    if (secondsLeft <= 0) return; // اگر زمان به صفر رسید، متوقف شود

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [secondsLeft]);

  // تبدیل ثانیه‌های باقی‌مانده به فرمت مورد نظر
  const { hours, minutes, seconds } = secondsToHHMMSS(Math.max(secondsLeft, 0));

  return (
    <div className="divide-brand-primary text-brand-primary flex w-full items-center divide-x-[1px] rounded-lg bg-white lg:p-2 p-1 text-xs lg:text-2xl *:flex *:flex-1 *:flex-col *:items-center *:lg:w-16.5 *:w-8">
      <div>
        <p className="font-medium h-fit">{seconds}</p>
        <p className="text-[10px]">ثانیه</p>
      </div>
      <div>
        <p className="font-medium h-fit">{minutes}</p>
        <p className="text-[10px]">دقیقه</p>
      </div>
      <div>
        <p className="font-medium h-fit">{hours}</p>
        <p className="text-[10px]">ساعت</p>
      </div>
    </div>
  );
}
