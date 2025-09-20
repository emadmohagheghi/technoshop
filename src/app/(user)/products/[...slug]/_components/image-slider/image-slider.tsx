"use client";
import { MutableRefObject, useState } from "react";
import {
  useKeenSlider,
  KeenSliderPlugin,
  KeenSliderInstance,
} from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { imageUrl } from "@/utils/product";
import { ArrowRight2, ArrowLeft2 } from "iconsax-reactjs";

function ThumbnailPlugin(
  mainRef: MutableRefObject<KeenSliderInstance | null>,
): KeenSliderPlugin {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("active");
      });
    }
    function addActive(idx: number) {
      slider.slides[idx].classList.add("active");
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx);
        });
      });
    }

    slider.on("created", () => {
      if (!mainRef.current) return;
      addActive(slider.track.details.rel);
      addClickEvents();
      mainRef.current.on("animationStarted", (main: KeenSliderInstance) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next));
      });
    });
  };
}

export default function ImageSlider({
  images,
}: {
  images: {
    id: number;
    image: {
      name: string;
    };
  }[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: 1,
      spacing: 10,
    },
    rtl: true,
    created() {
      setLoaded(true);
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: "auto",
        spacing: 10,
      },
      rtl: true,
    },
    [ThumbnailPlugin(instanceRef)],
  );

  return (
    <div className="flex w-full flex-col gap-y-2 lg:p-2">
      <div className="relative">
        <div ref={sliderRef} className="keen-slider">
          {images.map((image) => (
            <div key={image.id} className="keen-slider__slide">
              <Image
                src={imageUrl(image.image.name)}
                alt={`Slide ${image.id}`}
                width={512}
                height={512}
                className="mx-auto"
              />
            </div>
          ))}
        </div>
        {/* next and prev btn */}
        {images.length > 1 && loaded && instanceRef.current && (
          <>
            <button
              onClick={() => instanceRef.current?.next()}
              disabled={
                currentSlide === instanceRef.current.track.details.maxIdx
              }
              className="absolute top-1/2 left-0 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-gray-300 transition hover:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            >
              <ArrowLeft2 />
            </button>
            <button
              onClick={() => instanceRef.current?.prev()}
              disabled={currentSlide === 0}
              className="absolute top-1/2 right-0 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-gray-300 transition hover:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            >
              <ArrowRight2 />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          ref={thumbnailRef}
          className="keen-slider thumbnail !hidden lg:!flex"
        >
          {images.map((image) => (
            <div
              key={image.id}
              className="keen-slider__slide rounded-lg border"
            >
              <Image
                src={imageUrl(image.image.name)}
                alt={`Slide ${image.id}`}
                width={128}
                height={128}
                className="w-23.5 cursor-pointer xl:w-30"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
