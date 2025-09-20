import Image from "next/image";
import Link from "next/link";
import { Button } from "./_components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col justify-center items-center mt-20 gap-5">
      <Image src="/images/404.png" alt="Not found" width={934} height={515} className="aspect-[934/515] object-cover w-150" />
      <p dir="ltr" className="text-center text-2xl font-medium">
        صفحه مورد نظر یافت نشد
      </p>
      <Button size="lg" asChild className="bg-brand-primary hover:bg-brand-primary-focus">
        <Link href="/">بازگشت به صفحه اصلی</Link>
      </Button>
    </div>
  );
}
