import React from "react";
import { useKeenSlider } from "keen-slider/react";
import type { KeenSliderOptions } from "keen-slider";
import "keen-slider/keen-slider.min.css";

type CarouselProps = {
  children: React.ReactNode;
  className?: string;
} & KeenSliderOptions;

const Carousel = ({ children, className, ...rest }: CarouselProps) => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(rest);

  return (
    <div ref={sliderRef} className={`keen-slider ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return <div className="keen-slider__slide">{child}</div>;
        }
        return null;
      })}
    </div>
  );
};

export default Carousel;
