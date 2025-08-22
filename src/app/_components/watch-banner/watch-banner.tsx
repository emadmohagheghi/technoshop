import Image from "next/image";
import { ArrowLeft2 } from "iconsax-reactjs";

export default function WatchBanner() {
  return (
    <div className="relative w-full">
      <Image
        src="/images/banner/banner-2.png"
        alt=""
        width={1224}
        height={420}
      />
      <button className="text-brand-primary absolute top-1/2 right-4 flex translate-y-2 items-center justify-center gap-1 rounded-md bg-white px-2 py-1 text-[8px] font-medium sm:right-6 sm:translate-y-4 md:right-10 md:translate-y-6 lg:right-14 lg:translate-y-8 lg:px-4 lg:py-2 lg:text-sm xl:right-16">
        مشاهده محصولات
        <ArrowLeft2 className="stroke-primary" size={16} />
      </button>
    </div>
  );
}
