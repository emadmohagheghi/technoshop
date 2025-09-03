import { Button } from "@/app/_components/ui/button";
import { ShoppingCart } from "iconsax-reactjs";

export default function AddToCart() {
  return (
    <Button className="bg-brand-primary hover:bg-brand-primary-focus cursor-pointer !p-4 xs:!p-7 text-sm font-medium lg:text-lg lg:font-bold">
      افزودن به سبد خرید
      <ShoppingCart className="size-5" />
    </Button>
  );
}
