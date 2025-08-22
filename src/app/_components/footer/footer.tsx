import Image from "next/image";
import Communication from "./communication";
import { Call, Sms } from "iconsax-reactjs";

export default function Footer() {
  return (
    <footer className="">
      <Communication />
      <div className="container space-y-5 px-3 py-5">
        <div className="grid grid-cols-4 gap-10">
          <div className="col-span-4 flex flex-col items-center justify-center lg:order-2 lg:col-span-1">
            <div className="w-full space-y-5 lg:space-y-10">
              <Image
                src="/images/logo.svg"
                alt="logo"
                width={200}
                height={80}
                className="aspect-[200/80]"
              />
              <div className="text-brand-primary w-full space-y-2">
                <p className="text-base font-medium">آدرس فروشگاه:</p>
                <p className="w-full text-xs lg:text-sm">
                  تهران، خیابان ولیعصر، بالاتر از زرتشت، کوچه جاوید، پلاک ۲۴
                  <br />
                  کد پستی: 1594843812
                </p>
              </div>
            </div>
          </div>
          <div className="text-brand-primary col-span-4 mt-10 grid grid-cols-4 gap-5 gap-y-10 lg:order-1 lg:col-span-3 lg:mt-20">
            <div className="col-span-2 space-y-5 lg:col-span-1">
              <p className="text-base font-medium lg:text-xl">خدمات</p>
              <ul className="space-y-4 text-xs lg:text-base">
                <li>قیمت لپ تاپ</li>
                <li>خرید لپ تاپ دست دوم</li>
                <li>گارانتی</li>
                <li>خرید اقساطی</li>
              </ul>
            </div>
            <div className="col-span-2 space-y-5 lg:col-span-1">
              <p className="text-base font-medium lg:text-xl">خرید لپ تاپ</p>
              <ul className="space-y-4 text-xs lg:text-base">
                <li>انتخاب هوشمند لپ تاپ</li>
                <li>قیمت لپ تاپ لنوو</li>
                <li>قیمت لپ تاپ ایسوس</li>
                <li>قیمت لپ تاپ اچ پی</li>
              </ul>
            </div>
            <div className="col-span-2 space-y-5 lg:col-span-1">
              <p className="text-base font-medium lg:text-xl">
                فروشگاه اینترنتی
              </p>
              <ul className="space-y-4 text-xs lg:text-base">
                <li>درباره ما</li>
                <li>تماس با ما</li>
                <li>شرایط و قوانین</li>
                <li>نظرات کاربران</li>
              </ul>
            </div>
            <div className="col-span-2 space-y-5 lg:col-span-1">
              <p className="text-base font-medium lg:text-xl">پشتیبانی</p>
              <ul className="space-y-4 text-xs lg:text-base">
                <li>شنبه تا پنجشنبه ۸:۳۰ الی ۱۸:۳۰</li>
                <li className="flex items-center gap-1">
                  <Sms variant="Bold" className="fill-brand-" size={32} />
                  technoshop@gmail.com
                </li>
                <li className="flex items-center gap-1">
                  <Call variant="Bold" className="fill-brand-" size={32} />
                  <div>
                    <p>تلفن امور مشتریان</p>
                    <p>۰۲۱۰۰۰۰</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="mx-auto flex w-fit gap-2 sm:gap-6 lg:mx-0 lg:mr-auto lg:gap-x-8">
            <Image
              src="/images/footer-banners/namad-1.png"
              alt="technoshop"
              width={75}
              height={90}
            />

            <Image
              src="/images/footer-banners/namad-2.png"
              alt="technoshop"
              width={75}
              height={90}
            />
            <Image
              src="/images/footer-banners/namad-3.png"
              alt="technoshop"
              width={75}
              height={90}
            />
          </div>
        </div>
      </div>
      <div className="p-2 lg:p-0">
        <div className="bg-brand-primary px-3 py-5 text-center text-[10px] text-white lg:text-xs">
          تمامی حقوق مادی و معنوی این سایت متعلق به تکنوشاپ می‌باشد.
        </div>
      </div>
    </footer>
  );
}
