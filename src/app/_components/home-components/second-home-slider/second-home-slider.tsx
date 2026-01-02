import Carousel from "@/app/_components/ui/carousel";
import Image from "next/image";

export default function SecondHomeSlider() {
  return (
    <Carousel slides={{ perView: "auto", spacing: 10 }} rtl>
      <Image
        src="/images/banner/banner-1.png"
        width={808}
        height={420}
        alt=""
      />
      <Image
        src="/images/banner/banner-1.png"
        width={808}
        height={420}
        alt=""
      />
      <Image
        src="/images/banner/banner-1.png"
        width={808}
        height={420}
        alt=""
      />
    </Carousel>
  );
}
