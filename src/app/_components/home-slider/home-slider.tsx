"use client";
import * as React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { imageUrl } from "@/utils/product";
import { ArrowRight2, ArrowLeft2 } from "iconsax-reactjs";
import { useBanner } from "@/hooks/use-benner";

export default function HomeSlider() {
  const { data: banners = [], isFetching, error } = useBanner();

  const sliderBanners = banners.filter(
    (banner) => banner.position === "HOME_SLIDER_BANNER",
  );
  const sideBanners = banners.filter(
    (banner) => banner.position === "HOME_SIDE_BANNER",
  );

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
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

  if (isFetching)
    return (
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex-3 rounded-xl">
          <Skeleton className="aspect-[912/412] w-full" />
        </div>
        <div className="flex flex-1 gap-3 lg:flex-col">
          <Skeleton className="aspect-[304/200] w-full" />
          <Skeleton className="aspect-[304/200] w-full" />
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-3 overflow-hidden rounded-xl">
        <div ref={sliderRef} className="keen-slider curved">
          {sliderBanners.map((banner) => (
            <div key={banner.id} className="keen-slider__slide">
              <Image
                src={imageUrl(banner.image.name)}
                alt={banner.title}
                width={912}
                height={412}
                className="w-full"
              />
            </div>
          ))}
        </div>
        <div
          className="home-slider-curved absolute -right-0.5 -bottom-0.5 hidden h-15 justify-between gap-3 p-3 md:flex rounded-xl"
        >
          <button
            onClick={() => instanceRef.current?.prev()}
            className="flex aspect-square w-full cursor-pointer items-center justify-center rounded-[10px] bg-gray-300"
          >
            <ArrowRight2 />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="flex aspect-square w-full cursor-pointer items-center justify-center rounded-[10px] bg-gray-300"
          >
            <ArrowLeft2 />
          </button>
        </div>
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
