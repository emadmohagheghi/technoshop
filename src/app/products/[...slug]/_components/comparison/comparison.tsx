import { Button } from "@/app/_components/ui/button";
import { ChartSquare } from "iconsax-reactjs";

export default function Comparison() {
  return (
    <Button className="cursor-pointer text-xs lg:text-base py-8 " variant="secondary">
      مقایسه کن
      <ChartSquare className="size-5 lg:size-6" size={24} />
    </Button>
  );
}
