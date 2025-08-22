"use client";
import { Instagram, Whatsapp, Youtube } from "iconsax-reactjs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";

export default function Communication() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast("ایمیل شما با موفقیت ثبت شد!");
  };

  return (
    <div className="bg-shade-800">
      <div className="container mx-auto flex flex-col items-center justify-between gap-10 px-2 py-10 lg:flex-row">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[500px] space-y-2"
        >
          <p className="text-sm font-bold text-white">
            برای دریافت آخرین اخبار وتخفیف های جدید,ایمیل خود را وارد نمایید
          </p>
          <div className="flex gap-2">
            <Input
              required
              type="email"
              className="text-gray-300 placeholder:text-gray-300"
              placeholder="ایمیل شما"
            />
            <Button
              className="bg-brand-primary hover:bg-brand-primary-focus text-brand-primary-content"
              type="submit"
            >
              ثبت
            </Button>
          </div>
        </form>
        <div className="space-y-2">
          <p className="text-center text-sm font-bold text-white">
            شبکه های اجتماعی
          </p>
          <div className="*:bg-tint-300 flex w-fit gap-2 *:flex *:size-12 *:cursor-pointer *:items-center *:justify-center *:rounded-lg">
            <div>
              <Instagram size={24} className="text-white" />
            </div>
            <div>
              <Whatsapp size={24} className="text-white" />
            </div>
            <div>
              <Youtube size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
