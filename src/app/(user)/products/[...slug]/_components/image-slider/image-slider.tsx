"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import {
  KeenSliderInstance,
  KeenSliderPlugin,
  useKeenSlider,
} from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { imageUrl } from "@/utils/product";

type ProductImage = {
  id: number;
  image: {
    name: string;
  };
};

function ThumbnailPlugin(
  mainInstance: KeenSliderInstance,
): KeenSliderPlugin {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("active");
      });
    }

    function addActive(index: number) {
      slider.slides[index]?.classList.add("active");
    }

    function addClickEvents() {
      slider.slides.forEach((slide, index) => {
        slide.addEventListener("click", () => {
          mainInstance.moveToIdx(index);
        });
      });
    }

    slider.on("created", () => {
      addActive(slider.track.details.rel);
      addClickEvents();
      mainInstance.on("animationStarted", (main) => {
        removeActive();
        const next = main.animator.targetIdx ?? 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next));
      });
    });
  };
}

function ThumbnailSlider({
  images,
  mainInstance,
}: {
  images: ProductImage[];
  mainInstance: KeenSliderInstance;
}) {
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: "auto",
        spacing: 10,
      },
      rtl: true,
    },
    [ThumbnailPlugin(mainInstance)],
  );

  return (
    <div ref={thumbnailRef} className="keen-slider thumbnail !hidden lg:!flex">
      {images.map((image) => (
        <div key={image.id} className="keen-slider__slide rounded-lg border">
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
  );
}

export default function ImageSlider({ images }: { images: ProductImage[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mainInstance, setMainInstance] =
    useState<KeenSliderInstance | null>(null);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: 1,
      spacing: 10,
    },
    rtl: true,
    created(slider) {
      setMainInstance(slider);
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

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

        {images.length > 1 && mainInstance && (
          <>
            <button
              onClick={() => mainInstance.next()}
              disabled={currentSlide >= images.length - 1}
              className="absolute top-1/2 left-0 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-gray-300 transition hover:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            >
              <ArrowLeft2 />
            </button>
            <button
              onClick={() => mainInstance.prev()}
              disabled={currentSlide === 0}
              className="absolute top-1/2 right-0 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-gray-300 transition hover:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            >
              <ArrowRight2 />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && mainInstance && (
        <ThumbnailSlider images={images} mainInstance={mainInstance} />
      )}
    </div>
  );
}
