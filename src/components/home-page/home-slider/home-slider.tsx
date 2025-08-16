"use client";
import * as React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { Banner } from "@/types/banner.types";
import { Skeleton } from "../../ui/skeleton";
import { imageUrl } from "@/utils/product";

type HomeSliderProps = {
  banners: Banner[];
  isLoading: boolean;
};

export default function HomeSlider({ banners, isLoading }: HomeSliderProps) {
  const sliderBanners = banners.filter(
    (banner) => banner.position === "HOME_SLIDER_BANNER",
  );
  const sideBanners = banners.filter(
    (banner) => banner.position === "HOME_SIDE_BANNER",
  );

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      rtl: true,
      loop: true,
      mode: "snap",
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 5000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ],
  );

  if (isLoading) return <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
    <div className="flex-3 rounded-xl">
      <Skeleton className="w-full aspect-[912/412]" />
    </div>
    <div className="flex flex-1 gap-3 lg:flex-col">
      <Skeleton className="w-full aspect-[304/200]" />
      <Skeleton className="w-full aspect-[304/200]" />
    </div>
  </div>

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div ref={sliderRef} className="keen-slider flex-3 rounded-xl">
        {sliderBanners.map((banner) => (
          <div key={banner.id} className="keen-slider__slide">
            <Image
              src={imageUrl(banner.image.name)}
              alt={banner.title}
              width={912}
              height={412}
              className="w-full rounded-lg"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-1 gap-3 lg:flex-col">
        {sideBanners.map((banner) => (
          <div key={banner.id} className="w-full">
            <Image
              src={imageUrl(banner.image.name)}
              alt={banner.title}
              width={304}
              height={200}
              className="w-full rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
